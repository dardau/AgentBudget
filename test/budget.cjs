const assert=require('node:assert/strict');const hre=require('hardhat');const {ethers}=require('ethers');
const id=n=>ethers.id(String(n));let p,owner,agent,provider,other,c,rec;
async function deploy(name,args=[]){const a=await hre.artifacts.readArtifact(name);return await new ethers.ContractFactory(a.abi,a.bytecode,owner).deploy(...args);}
async function fail(fn,error){try{await fn();assert.fail('Expected revert '+error);}catch(e){if(e.code==='ERR_ASSERTION')throw e;const data=e.data||e.info?.error?.data; if(data && typeof data==='string')assert.equal(data.slice(0,10),c.interface.getError(error).selector);else assert.match(String(e),/revert|CALL_EXCEPTION/);}}
describe('AgentBudget local security and business rules',function(){
 beforeEach(async()=>{await hre.network.provider.send('hardhat_reset');p=new ethers.BrowserProvider(hre.network.provider);owner=await p.getSigner(0);agent=await p.getSigner(1);provider=await p.getSigner(2);other=await p.getSigner(3);const b=await p.getBlock('latest');c=await deploy('AgentBudget',[agent.address,100,250,b.timestamp+3600]);await c.waitForDeployment();await(await c.fund({value:250})).wait();await(await c.setProvider(provider.address,true)).wait();});
 it('pays an allowed provider and records exact spend',async()=>{const b=await p.getBalance(provider.address);await(await c.connect(agent).pay(id(1),provider.address,100)).wait();assert.equal(await c.spent(),100n);assert.equal(BigInt(await hre.network.provider.send('eth_getBalance',[provider.address,'latest'])),b+100n);assert.equal(await c.usedRequest(id(1)),true);});
 it('rejects payment above the per-request cap',async()=>fail(()=>c.connect(agent).pay(id(1),provider.address,101),'PaymentLimit'));
 it('rejects cumulative budget overrun',async()=>{for(let i=1;i<=2;i++)await(await c.connect(agent).pay(id(i),provider.address,100)).wait();await fail(()=>c.connect(agent).pay(id(3),provider.address,51),'BudgetLimit');assert.equal(await c.spent(),200n);});
 it('rejects a duplicate request ID',async()=>{await(await c.connect(agent).pay(id(1),provider.address,50)).wait();await fail(()=>c.connect(agent).pay(id(1),provider.address,50),'Duplicate');});
 it('rejects payments at the deadline',async()=>{await hre.network.provider.send('evm_setNextBlockTimestamp',[Number(await c.deadline())]);await hre.network.provider.send('evm_mine');await fail(()=>c.connect(agent).pay(id(1),provider.address,50),'Expired');});
 it('allows owner recovery while paused',async()=>{await(await c.setPaused(true)).wait();await(await c.withdraw(250)).wait();assert.equal(BigInt(await hre.network.provider.send('eth_getBalance',[await c.getAddress(),'latest'])),0n);});
 it('rejects unauthorized policy changes and withdrawal',async()=>{await fail(()=>c.connect(agent).setProvider(other.address,true),'Unauthorized');await fail(()=>c.connect(agent).withdraw(1),'Unauthorized');await fail(()=>c.connect(other).setPaused(true),'Unauthorized');});
 it('revokes the old agent after rotation',async()=>{await(await c.setAgent(other.address)).wait();await fail(()=>c.connect(agent).pay(id(1),provider.address,50),'Unauthorized');await(await c.connect(other).pay(id(2),provider.address,50)).wait();});
 it('rejects agent rotation by the agent or an unrelated account',async()=>{
  for(const caller of [agent,other]){
   await fail(()=>c.connect(caller).setAgent(provider.address),'Unauthorized');
   assert.equal(await c.agent(),agent.address);
  }
  await(await c.connect(agent).pay(id('after-denied-rotation'),provider.address,50)).wait();
  assert.equal(await c.spent(),50n);
 });
 it('rejects zero and owner addresses during agent rotation',async()=>{
  for(const next of [ethers.ZeroAddress,owner.address]){
   await fail(()=>c.setAgent(next),'InvalidInput');
   assert.equal(await c.agent(),agent.address);
  }
  await(await c.setAgent(other.address)).wait();
  assert.equal(await c.agent(),other.address);
 });
 it('rejects contract deployment with an expired deadline',async()=>{
  const block=await p.getBlock('latest');
  const args=[agent.address,100,250,block.timestamp-1];
  await fail(()=>deploy('AgentBudget',args),'InvalidInput');
 });
 it('rejects zero and owner agents during deployment',async()=>{
  const block=await p.getBlock('latest');
  for(const initialAgent of [ethers.ZeroAddress,owner.address]){
   await fail(()=>deploy('AgentBudget',[initialAgent,100,250,block.timestamp+3600]),'InvalidInput');
  }
 });
 it('rejects invalid initial spending limits',async()=>{
  const block=await p.getBlock('latest');
  for(const [paymentLimit,totalBudget] of [[0,250],[100,99]]){
   await fail(()=>deploy('AgentBudget',[agent.address,paymentLimit,totalBudget,block.timestamp+3600]),'InvalidInput');
  }
  const exactBudget=await deploy('AgentBudget',[agent.address,100,100,block.timestamp+3600]);
  await exactBudget.waitForDeployment();
  assert.equal(await exactBudget.perPaymentLimit(),100n);
  assert.equal(await exactBudget.budgetLimit(),100n);
 });
 it('rolls back accounting when provider rejects payment',async()=>{rec=await deploy('TestReceiver');await rec.waitForDeployment();await(await rec.configure(await c.getAddress(),true,false)).wait();await(await c.setProvider(await rec.getAddress(),true)).wait();await fail(()=>c.connect(agent).pay(id(1),rec.target,50),'TransferFailed');assert.equal(await c.spent(),0n);assert.equal(await c.usedRequest(id(1)),false);});
 it('blocks callback reentrancy even when receiver is the agent',async()=>{rec=await deploy('TestReceiver');await rec.waitForDeployment();await(await rec.configure(c.target,false,true)).wait();await(await c.setProvider(rec.target,true)).wait();await(await c.setAgent(rec.target)).wait();await(await rec.trigger(id(1),50)).wait();assert.equal(await rec.blocked(),true);assert.equal(await c.spent(),50n);});
 it('rejects zero value and insufficient contract balance',async()=>{await fail(()=>c.connect(agent).pay(id(1),provider.address,0),'InvalidInput');await(await c.withdraw(240)).wait();await fail(()=>c.connect(agent).pay(id(2),provider.address,11),'InsufficientFunds');});
 it('accepts the exact cumulative budget boundary',async()=>{for(const [i,n] of [100,100,50].entries())await(await c.connect(agent).pay(id(i+1),provider.address,n)).wait();assert.equal(await c.spent(),250n);});
});
