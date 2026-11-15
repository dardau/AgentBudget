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

The revised submission separates observed evidence from a calculated launch condition. Case 1 combines unlike external samples and is retained as a cross-study illustration only. It has NPV −$32,337.81 and requires $48,400 if spending continues. Case 6 archives the unsupported original targets. Neither estimates AgentBudget demand.

The new Launch threshold sheet solves the inverse question: which constant monthly paid additions produce NPV = 0 under the stated $49 net price, cost budget and 55% annual retention reference? Monthly survival is `0.55^(1/12)`. One new team each month yields annual billed team-months of 59.6507917821, 141.2211019522 and 186.0847725458. At $46 contribution, annual contribution coefficients are $2,743.936422, $6,496.170690 and $8,559.899537. Annual fixed expenses are $10,680.175557, $13,560.175557 and $16,440.175557.

For constant additions n, annual pretax income is `n × coefficient − fixed expense`. Annual cash subtracts 20% of positive annual income. Solving `−initial + sum(annual cash / 1.25^year) = 0` gives **3.4740111185 new paid teams/month**. The minimum constant whole-number condition with positive NPV is therefore **4/month from month 1**. The workbook enumerates all eight tax-sign regimes; an independent Python bisection confirms the root. Three/month produces negative NPV of $−4,279.05.

This is a launch requirement, not evidence that customers exist. It needs 144 distinct paying teams acquired over 36 months before churn, within 16/24/32 acquisition hours monthly. The implied labour-only CAC limits are $120/$180/$240. The old cold-email illustration does not establish such a channel. The acquisition, retention, price and service-cost conditions remain unverified.

| Item | Formula or schedule | Result, USD |
|---|---|---:|
| Initial expense | 120 × 30 + 5,000 + 4 × 60,000 / 444.3 | 9,140.18 |
| Peak cumulative need | Maximum deficit in the 36-month case-8 schedule | 11,466.47 |
| Interim operating deficit | Peak need − initial outflow | 2,326.29 |
| Three-month reserve | 3 × 890.014630 | 2,670.04 |
| Conditional funding | Ceiling((11,466.467480 + 2,670.043889) / 100) × 100 | 14,200.00 |
| Post-money at illustrative 20% | 14,200 / 0.20 | 71,000.00 |
| Pre-money | 71,000 − 14,200 | 56,800.00 |
| Exit for 2× investor money | 2 × 14,200 / 0.20 | 142,000.00 |
| Exit for 25% annually over 5 years | 14,200 × 1.25^5 / 0.20 | 216,674.80 |

Case 8 annual after-tax cash flows are $236.456105, $9,939.605762 and $14,239.538073. The initial outflow is $9,140.175557. Thus NPV at 25% is **$4,700.98**, and cumulative project cash first becomes non-negative in **month 22**. Financing and terminal value are excluded from NPV. The early cash deficit is still funded even though total Year 1 operating cash is positive.

Two sourced adverse cases hold the required sales and retention fixed: $59/hour labour gives NPV −$21,712.45, no 36-month payback and $30,200 funding; $40 monthly net price gives NPV −$2,316.59, month-31 payback and $14,800 funding. At the same $14,200 starting cash, the upper-rate case fails in month 1. Scenarios have no assigned probabilities. These comparisons are not demand-elasticity estimates.

Two times money in five years gives `2^(1/5) − 1 = 14.87%` annually. A 25% target requires `1.25^5 = 3.0518×`. The exit figures are required values, not forecast sales of the company. Dilution, fees and debt are excluded. Funding need does not establish fair value.

## Conclusion for the defense

The prototype demonstrates deterministic spending controls locally. A viable launch is conditional on the calculated acquisition requirement and the other stated inputs. At $49 net/month, the buyer value threshold remains `49/30 × 60 = 98` minutes saved monthly against a free alternative with equal other costs. The educational request is to approve an evidence plan and consider the $14,200 envelope only after value, acquisition performance, retention, service scope and legal/security requirements are validated. No real investment or completed customer study is claimed.

## Basis for the revised inputs

The $49 test price matches an adjacent developer-tool entry tariff, [Portkey Production](https://portkey.ai/pricing). [AgentOps Pro](https://www.agentops.ai/) starts at $40 and supplies the lower-price sensitivity. These products differ in scope; their tariffs do not establish AgentBudget willingness to pay. The threshold remains `49 / 30 * 60 = 98` minutes of monthly savings against a free alternative with equal other costs.

The higher-cost case uses the $59/hour upper endpoint of the [Upwork $30–59 range](https://www.upwork.com/hire/blockchain-developers/), changing labour only. Zero/full retention are mathematical limits. The 25% discount is the midpoint of the course’s required 20–30% range. Three months of fixed expense form a chosen quarterly liquidity buffer, not a probabilistic risk estimate. The 20% stake and five-year holding period define illustrative deal and return questions, not a market valuation or predicted exit.

External funnel references: [Hunter 2026](https://hunter.io/the-state-of-cold-email), [First Page Sage](https://firstpagesage.com/seo-blog/saas-free-trial-conversion-rate-benchmarks/), and [ChartMogul 2025, pp.25/36](https://chartmogul.com/reports/saas-billing-report/saas-billing-report-2025.pdf). Accessed 15 November 2026. No product-specific survey, pilot sale or conversion observation is claimed.
