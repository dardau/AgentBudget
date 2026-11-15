const assert = require('node:assert/strict');
const hre = require('hardhat');
const { ethers } = require('ethers');

// Zhansaya Boranbaeva's assigned area: unauthorized access, providers and pause.
describe('Security invariants for policy rejection and recovery', function () {
  let contract, owner, agent, supplier, outsider;
  const requestId = ethers.id('security-review-request');

  beforeEach(async function () {
    await hre.network.provider.send('hardhat_reset');
    const provider = new ethers.BrowserProvider(hre.network.provider);
    [owner, agent, supplier, outsider] = await Promise.all([0, 1, 2, 3].map(i => provider.getSigner(i)));
    const artifact = await hre.artifacts.readArtifact('AgentBudget');
    const block = await provider.getBlock('latest');
    contract = await new ethers.ContractFactory(artifact.abi, artifact.bytecode, owner)
      .deploy(agent.address, 100, 250, block.timestamp + 3600);
    await contract.waitForDeployment();
    await (await contract.fund({value: 250})).wait();
    await (await contract.setProvider(supplier.address, true)).wait();
  });

  async function rejects(action, errorName) {
    await assert.rejects(action, error => {
      const data = error.data ?? error.info?.error?.data;
      return typeof data === 'string' &&
        data.slice(0, 10) === contract.interface.getError(errorName).selector;
    });
  }

  async function unchanged() {
    assert.equal(await contract.spent(), 0n);
    assert.equal(await contract.usedRequest(requestId), false);
    const balance = await hre.network.provider.send('eth_getBalance', [contract.target, 'latest']);
    assert.equal(BigInt(balance), 250n);
  }

  it('preserves balance and request state after an unauthorized payment', async function () {
    await rejects(() => contract.connect(outsider).pay(requestId, supplier.address, 80), 'Unauthorized');
    await unchanged();
  });

  it('does not let an unauthorized account approve its own recipient', async function () {
    await rejects(() => contract.connect(outsider).setProvider(outsider.address, true), 'Unauthorized');
    assert.equal(await contract.allowed(outsider.address), false);
    await unchanged();
  });

  it('preserves balance and request state for an unapproved recipient', async function () {
    await rejects(() => contract.connect(agent).pay(requestId, outsider.address, 80), 'ProviderDenied');
    await unchanged();
  });

  it('blocks a previously approved recipient after owner revocation', async function () {
    await (await contract.setProvider(supplier.address, false)).wait();
    await rejects(() => contract.connect(agent).pay(requestId, supplier.address, 80), 'ProviderDenied');
    await unchanged();
  });

  it('keeps a paused request reusable after an authorized resume', async function () {
    await (await contract.setPaused(true)).wait();
    await rejects(() => contract.connect(agent).pay(requestId, supplier.address, 80), 'Stopped');
    await unchanged();
    await (await contract.setPaused(false)).wait();
    // Send after the confirmed resume without reusing BrowserProvider's short-lived
    // estimateGas cache for the identical call that just failed while paused.
    await (await contract.connect(agent).pay(requestId, supplier.address, 80, {gasLimit: 300000})).wait();
    assert.equal(await contract.spent(), 80n);
    assert.equal(await contract.usedRequest(requestId), true);
  });

  it('does not let the spending agent remove the emergency pause', async function () {
    await (await contract.setPaused(true)).wait();
    await rejects(() => contract.connect(agent).setPaused(false), 'Unauthorized');
    assert.equal(await contract.paused(), true);
    await unchanged();
  });
});
