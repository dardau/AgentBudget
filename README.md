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
- `test/budget.cjs`: 12 baseline tests, including failure and callback behaviour.
- `test/security-invariants.cjs`: 6 scoped tests replacing 3 basic checks, covering unauthorized access, denied/revoked providers, and pause/recovery state.
- `risk-and-investor-review.md`: risk controls, budget mapping and conditional investor-return calculations.
- `scripts/demo.cjs`: deployment and sequential demonstration.
- `hardhat.config.cjs`: local network and compiler configuration.

## Demo and repository links

- Repository: https://github.com/dardau/AgentBudget
- [Watch the prototype demonstration (1:43)](https://github.com/user-attachments/assets/7c156914-14ec-4927-a8a6-5eb721145600). Recorded terminal session with English captions: local deployment, payment controls, recovery and 18 passing tests.
- [Watch demo 2 — animated interface with English voiceover (1:41)](demos/AgentBudget_Demo_2.mp4). Visual replay of the local test scenario with cursor clicks, payment checks, balance changes and recovery. The interface illustrates the recorded scenario; it is not connected to a live blockchain or real data provider.
- Reproduce the demonstration: `npm run demo`; run the tests with `npm test`.
- The script deploys locally, funds 250 test units, pays 80, rejects invalid requests, pauses and recovers 170. Agent behaviour and supplier data are deterministic simulations.
- Local chain ID: 31337. No public testnet or mainnet deployment exists.

## Security boundaries

The owner is trusted to control its own budget. Agent compromise can still spend the remaining budget at approved providers. Owner compromise is not solved by this prototype. A valid payment does not prove useful data delivery. Request IDs prevent exact duplicate IDs only, not two different IDs for the same economic task. A pending payment can execute before a later pause. Provider changes and agent rotation require the owner. New deployments reset budget accounting; there is no global cross-contract cap.

Checks-effects-interactions and OpenZeppelin ReentrancyGuard protect the external transfer path. Tests verify rollback on a failed provider transfer. They do not constitute an independent audit. No real private keys or seed phrases are required or printed. Environment secrets, if later needed only for course work, must stay in `.env` excluded by `.gitignore`. Never use a wallet holding real assets.

## Third-party attribution

OpenZeppelin Contracts 5.4.0 is used under the MIT licence; see `THIRD_PARTY_NOTICES.md` and the dependency licence.

The additional tests and risk/investor review correspond to Zhansaya Boranbaeva's supplied self-assessment. Students must review and understand submitted work; each member should commit their own actual contribution from their own account. No customer interviews, paid pilots or personal review confirmations are claimed.

## Project preparation

AI tools were used to help develop and clarify the project idea. The remaining project work was completed by the team members.
