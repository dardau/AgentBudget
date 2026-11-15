# Risk and investor review

Assigned scope: Zhansaya Boranbaeva, SE-2532. Prepared with OpenAI Codex (GPT-6) assistance on 15 November 2026. This document supports report main pages 5–6 and 14–15, and the risk, investor-return and conclusion slides. It does not claim completed customer research or an independent security audit.

## Security evidence

Three original basic tests for unauthorized payment, denied recipients and paused payments are replaced by expanded scenarios. Twelve other baseline tests are retained. Six tests in `test/security-invariants.cjs` verify:

1. An unauthorized payment leaves `spent`, `usedRequest` and the contract balance unchanged.
2. An unauthorized account cannot approve its own provider address.
3. An unapproved recipient is rejected without consuming the request ID or balance.
4. Owner revocation blocks a previously approved provider.
5. A request rejected during a pause remains usable after an owner-authorized resume.
6. The agent cannot remove the emergency pause.

All 18 tests passed on the local Hardhat network. Error assertions compare the exact custom-error selector. The resumed payment supplies a gas limit to avoid reuse of BrowserProvider's short-lived estimate for the identical call that previously failed while paused; the successful receipt and post-state are still asserted.

Residual risks: a compromised owner can change recipients and withdraw funds; a compromised agent can spend within the remaining permitted budget; an allowed provider may deliver useless data; two distinct request IDs can represent the same economic task; a payment can execute before a pending pause. No multisignature owner, AI reasoning, production x402 adapter or external audit is implemented.

## Risk register and cost mapping

Likelihood and impact are ordinal team judgements: low 1, medium 2, high 3. Their product prioritizes attention and is not a probability or expected loss.

| Risk | Likelihood × impact | Response | Included budget |
|---|---|---|---|
| Market: users prefer free tools | 3 × 3 = 9 | Validate workflow time savings and price before build | Acquisition research: 16/24/32 h per month × $30 |
| Security: contract or credential compromise | 2 × 3 = 6 | Tested limits, allowlist, pause/recovery; scoped review | $5,000 initial review; 8 maintenance h/month |
| Operations: support exceeds allowance | 2 × 2 = 4 | Measure support and limit scope | 0.1 h per billed month × $30; cost +30% scenario |
| Financial: acquisition cost exceeds contribution | 3 × 3 = 9 | Monthly cash review; stop or redesign after failed validation | 4 admin h/month; three-month liquidity buffer |
| Regulatory: activity requires authorization | 2 × 3 = 6 | Review exact control and service perimeter before launch | 4 initial legal h; 1 legal h per quarter |

The $5,000 allowance is the upper end of a published $1,500–5,000 smart-contract audit project range, not a received quote ([Upwork](https://www.upwork.com/hire/blockchain-developers/), accessed 15 November 2026). Legal fees use the published KZT 60,000/hour business rate ([Utkin](https://www.utkin.kz/)) and 444.30 KZT/USD on 14 November 2026 ([NBK dated XML](https://nationalbank.kz/rss/get_rates.cfm?fdate=14.11.2026)). Initial legal allowance = 4 × 60,000 / 444.3 = $540.175557; monthly reserve = 60,000 / 444.3 / 3 = $45.014630. Hours are scope estimates. The reserve is not a licence quote.

A hypothetical Kazakhstan LLP would supply software, but the actual activity determines the legal perimeter. Relevant official texts are the [digital-assets law](https://old.adilet.zan.kz/eng/docs/Z2300000193), [personal-data law](https://old.adilet.zan.kz/eng/docs/Z1300000094) and [AFSA custody requirements](https://afsa.aifc.kz/regulated-activities/providing-custody/), accessed 15 November 2026. Customer control alone does not prove exemption. If custody or another regulated activity is required, the current pilot-scale model must be replaced with an appropriate capital and compliance plan. No real personal data is put on chain.

## Funding and return calculations

The revised reference case is conditional on external SaaS/outreach benchmarks with explicit transfer limitations. It is not an empirically estimated AgentBudget forecast. The original target is retained as case 6 in the revised workbook.

| Item | Formula | Result, USD |
|---|---|---:|
| Initial expense | 120 × 30 + 5,000 + 4 × 60,000 / 444.3 | 9,140.18 |
| Three-year operating deficits | 10,440.465271 + 12,872.814943 + 15,288.774855 | 38,602.06 |
| Peak financing need | Initial expense + deficits | 47,742.23 |
| Three-month fixed-cost reserve | 3 × 890.014630 | 2,670.04 |
| Rounded funding envelope | Ceiling((47,742.230626 + 2,670.043889) / 100) × 100 | 50,500.00 |
| Post-money, illustrative 20% stake | 50,500 / 0.20 | 252,500.00 |
| Pre-money | 252,500 − 50,500 | 202,000.00 |
| Exit threshold for 2× investor money | 2 × 50,500 / 0.20 | 505,000.00 |
| Exit threshold for 25% annually over 5 years | 50,500 × 1.25^5 / 0.20 | 770,568.85 |

Two times money in five years gives `2^(1/5) − 1 = 14.87%` annually. A 25% target requires `1.25^5 = 3.0518×`. These are arithmetic thresholds, not forecasts; dilution, transaction fees and debt would alter investor proceeds. Increasing the funding need does not increase fair value.

Project NPV uses the initial outflow and three annual year-end operating cash flows, excluding financing and terminal value:

`−9,140.175557 − 10,440.465271/1.25 − 12,872.814943/1.25^2 − 15,288.774855/1.25^3 = −33,559.00`.

No payback occurs within 36 months. A $50,500 envelope covers the reference continuation schedule; it does not justify committing that amount. The decision gate must come before production build and external-review spending.

## Conclusion for the defense

The prototype demonstrates deterministic spending controls locally. It does not establish customer demand, production security or legal permission. At a proposed net subscription of $49, the buyer must save 49/30 × 60 = 98 minutes monthly versus a free alternative with equal payment costs. The next hypothetical decision is to validate that value, reduce acquisition cost and confirm security/legal scope. Defer a full funding commitment until the evidence changes the economics.
