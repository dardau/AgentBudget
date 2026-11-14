Educational project for the course Introduction to Finance. Not a real product, service or investment offer. Do not use with real funds.

# AgentBudget

A local Solidity prototype that limits an agent's purchasing authority. The owner controls provider permissions, agent rotation, pausing and recovery. Fixed lifetime budget, transaction cap and expiry constrain payment requests. The prototype uses native local test units, not USDC. It has no mainnet configuration, live AI reasoning, x402 adapter or real provider integration.

## Reproduce

Install Node.js 22 LTS and npm. From this directory:

```sh
npm ci
npm test
npm run demo
```

The first command downloads public open-source packages. No paid account or cryptocurrency is needed. Solidity 0.8.28 is included as a pinned npm dependency, so compilation does not download a compiler separately. Each command runs against an in-process Hardhat network. Do not run a public RPC node for this project or add a production network.

## Files

- `contracts/AgentBudget.sol`: core budget contract.
- `contracts/TestReceiver.sol`: adversarial receiver used only in tests.
- `test/budget.cjs`: 15 tests, including failure and callback behaviour.
- `scripts/demo.cjs`: deployment and sequential demonstration.
- `hardhat.config.cjs`: local network and compiler configuration.

## Demo and repository links

- Repository: https://github.com/dardau/AgentBudget
- The 65-second demo is part of the project materials.
- Video format: captioned terminal capture of actual command execution, edited for readability. Agent behaviour and supplier data are deterministic simulations. Re-run the commands above for an independent live demonstration.
- Local chain ID: 31337. No public testnet or mainnet deployment exists.

## Security boundaries

The owner is trusted to control its own budget. Agent compromise can still spend the remaining budget at approved providers. Owner compromise is not solved by this prototype. A valid payment does not prove useful data delivery. Request IDs prevent exact duplicate IDs only, not two different IDs for the same economic task. A pending payment can execute before a later pause. Provider changes and agent rotation require the owner. New deployments reset budget accounting; there is no global cross-contract cap.

Checks-effects-interactions and OpenZeppelin ReentrancyGuard protect the external transfer path. Tests verify rollback on a failed provider transfer. They do not constitute an independent audit. No real private keys or seed phrases are required or printed. Environment secrets, if later needed only for course work, must stay in `.env` excluded by `.gitignore`. Never use a wallet holding real assets.
