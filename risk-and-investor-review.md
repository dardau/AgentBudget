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
| Operations: support exceeds allowance | 2 × 2 = 4 | Measure support and limit scope | 0.1 h per billed month × $30; published $59/hour sensitivity |
| Financial: acquisition cost exceeds contribution | 3 × 3 = 9 | Monthly cash review; stop or redesign after failed validation | 4 admin h/month; three-month liquidity buffer |
| Regulatory: activity requires authorization | 2 × 3 = 6 | Review exact control and service perimeter before launch | 4 initial legal h; 1 legal h per quarter |

The $5,000 allowance is the upper end of a published $1,500–5,000 smart-contract audit project range, not a received quote ([Upwork](https://www.upwork.com/hire/blockchain-developers/), accessed 15 November 2026). Legal fees use the published KZT 60,000/hour business rate ([Utkin](https://www.utkin.kz/)) and 444.30 KZT/USD on 14 November 2026 ([NBK dated XML](https://nationalbank.kz/rss/get_rates.cfm?fdate=14.11.2026)). Initial legal allowance = 4 × 60,000 / 444.3 = $540.175557; monthly reserve = 60,000 / 444.3 / 3 = $45.014630. Hours are capped scope allocations: four initial legal topics (perimeter, terms, data, follow-up) and a quarterly one-hour review. The reserve is not a licence quote.

A hypothetical Kazakhstan LLP would supply software, but the actual activity determines the legal perimeter. Relevant official texts are the [digital-assets law](https://old.adilet.zan.kz/eng/docs/Z2300000193), [personal-data law](https://old.adilet.zan.kz/eng/docs/Z1300000094) and [AFSA custody requirements](https://afsa.aifc.kz/regulated-activities/providing-custody/), accessed 15 November 2026. Customer control alone does not prove exemption. If custody or another regulated activity is required, the current pilot-scale model must be replaced with an appropriate capital and compliance plan. No real personal data is put on chain.

## Funding and return calculations

The revised case 1 is a conditional benchmark-boundary calculation, not an estimated sales forecast. The unsupported 50% reply-to-trial estimate is removed: 100% represents the mathematical upper boundary for that step, while case 2 permits zero sales. Hunter’s 3% all-reply rate, First Page Sage’s 18.2% organic opt-in trial conversion and ChartMogul’s retention data come from different populations. Case 6 retains the original unsupported target only as an archive. Every independent input is mapped to a source, calculation, boundary or defined scope allowance in the submission Input register.

| Item | Formula | Result, USD |
|---|---|---:|
| Initial expense | 120 × 30 + 5,000 + 4 × 60,000 / 444.3 | 9,140.18 |
| Three-year operating deficits | 10,200.754985 + 12,185.454328 + 14,137.374153 | 36,523.58 |
| Peak financing need | Initial expense + deficits | 45,663.76 |
| Three-month fixed-cost reserve | 3 × 890.014630 | 2,670.04 |
| Rounded funding envelope | Ceiling((45,663.759023 + 2,670.043889) / 100) × 100 | 48,400.00 |
| Post-money, illustrative 20% stake | 48,400 / 0.20 | 242,000.00 |
| Pre-money | 242,000 − 48,400 | 193,600.00 |
| Exit threshold for 2× investor money | 2 × 48,400 / 0.20 | 484,000.00 |
| Exit threshold for 25% annually over 5 years | 48,400 × 1.25^5 / 0.20 | 738,525.39 |

Two times money in five years gives `2^(1/5) − 1 = 14.87%` annually. A 25% target requires `1.25^5 = 3.0518×`. These are arithmetic thresholds, not forecasts; dilution, transaction fees and debt would alter investor proceeds. Increasing the funding need does not increase fair value.

Project NPV uses the initial outflow and three annual year-end operating cash flows, excluding financing and terminal value:

`−9,140.175557 − 10,200.754985/1.25 − 12,185.454328/1.25^2 − 14,137.374153/1.25^3 = −32,337.81`.

No payback occurs within 36 months. A $48,400 envelope covers the conditional continuation schedule; it does not justify committing that amount. The decision gate must come before production build and external-review spending.

## Conclusion for the defense

The prototype demonstrates deterministic spending controls locally. It does not establish customer demand, production security or legal permission. At a proposed net subscription of $49, the buyer must save 49/30 × 60 = 98 minutes monthly versus a free alternative with equal payment costs. The next hypothetical decision is to validate that value, reduce acquisition cost and confirm security/legal scope. Defer a full funding commitment until the evidence changes the economics.

## Basis for the revised inputs

The $49 test price matches an adjacent developer-tool entry tariff, [Portkey Production](https://portkey.ai/pricing). [AgentOps Pro](https://www.agentops.ai/) starts at $40 and supplies the lower-price sensitivity. These products differ in scope; their tariffs do not establish AgentBudget willingness to pay. The threshold remains `49 / 30 * 60 = 98` minutes of monthly savings against a free alternative with equal other costs.

The higher-cost case uses the $59/hour upper endpoint of the [Upwork $30–59 range](https://www.upwork.com/hire/blockchain-developers/), changing labour only. Zero/full retention are mathematical limits. The 25% discount is the midpoint of the course’s required 20–30% range. Three months of fixed expense form a chosen quarterly liquidity buffer, not a probabilistic risk estimate. The 20% stake and five-year holding period define illustrative deal and return questions, not a market valuation or predicted exit.

External funnel references: [Hunter 2026](https://hunter.io/the-state-of-cold-email), [First Page Sage](https://firstpagesage.com/seo-blog/saas-free-trial-conversion-rate-benchmarks/), and [ChartMogul 2025, pp.25/36](https://chartmogul.com/reports/saas-billing-report/saas-billing-report-2025.pdf). Accessed 15 November 2026. No product-specific survey, pilot sale or conversion observation is claimed.
