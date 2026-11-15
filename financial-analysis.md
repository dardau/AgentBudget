# Financial model calculation review

Assigned financial scope: Alina Sharafitdin, SE-2532. This review covers acquisition assumptions, costs, cash flow, NPV and sensitivity, corresponding to main-text pages 9–12 in the supplied self-evaluation.

The review uses `AgentBudget_Fin.zip`, specifically `AgentBudget_FP_Financial_Model.xlsx`, `Appendices/Evidence/scenario_outputs.json` and `Appendices/Evidence/launch_threshold.json`. It follows the revised financial package: case 8 is a conditional launch specification, while case 6 retains the earlier model. Figures below are USD. They are scenario calculations, not actual sales, invoices or investment returns.

## Reproduce the checks

From the repository root, with Python 3 and no additional packages:

```sh
python3 scripts/check-financial-model.py
```

The script recalculates all ten scenarios, compares eight annual output series and the headline outputs against `finance/scenario-reference.json`, and solves the launch threshold using bisection. The reference file preserves the supplied results and the SHA-256 of the source archive. It is a comparison snapshot, not a separate observation of the business. Verification tolerance is USD 0.0000001; discrete outputs such as funding, payback month and break-even count must agree exactly. The executed comparison found a maximum numeric difference of approximately USD 0.00000000000728.

## Acquisition and subscription revenue

For each month, retained teams equal opening teams multiplied by monthly survival. Closing teams equal retained teams plus new teams. Billed team-months equal retained teams plus half of new teams, assuming new subscriptions start evenly during the month. Revenue equals billed team-months multiplied by the net monthly price.

Cases 1–7 use the supplied comparison assumptions. Case 1 combines 32/48/64 researched candidates per month in Years 1/2/3 with 3% response and 18.2% paid conversion. These external samples do not establish this product's sales conversion. Case 6 uses the archived 30% response, 50% trial, 25% paid conversion and 2% monthly churn. Cases 8–10 instead require four new paid teams every month from month 1. Their monthly survival is `0.55^(1/12)`, approximately 0.951401. The four-team condition is derived from the NPV boundary, not from measured demand.

## Cost structure and financial statements

At the base labour rate of $30/hour:

| Item | Calculation | Result |
|---|---|---:|
| Initial build | 120 hours × $30 | $3,600.00 |
| Initial security review allowance | Fixed scenario allowance | $5,000.00 |
| Initial legal scoping | 4 × KZT 60,000 ÷ 444.30 | $540.18 |
| Total initial expense | Build + review + legal | $9,140.18 |
| Monthly legal allowance | KZT 60,000 ÷ 444.30 ÷ 3 | $45.01 |
| Variable support per billed team-month | 0.1 hour × $30 | $3.00 |
| Contribution per billed team-month | $49 − $3 | $46.00 |

Monthly fixed cost is `(12 + candidates × 0.5) × hourly rate + 5 + monthly legal allowance`. The 12 hours comprise eight maintenance and four administration hours. This gives $890.01, $1,130.01 and $1,370.01 per month in the three operating years. Hours and review budgets remain planning allocations; reproducing their arithmetic does not validate the workload or obtain a supplier quote.

Annual pretax income is revenue less support and fixed expenses. The model deducts an illustrative 20% provision on positive annual pretax income at year end, without loss carryforward. This is the supplied modelling convention, not tax advice. With no working-capital movements, debt or later capital expenditure, after-tax income equals operating project cash flow. Client payment budgets and equity funding are excluded from revenue.

| Case 8 annual statement, USD | Year 1 | Year 2 | Year 3 |
|---|---:|---:|---:|
| Subscription revenue | 11,691.56 | 27,679.34 | 36,472.62 |
| Variable support | 715.81 | 1,694.65 | 2,233.02 |
| Fixed expenses | 10,680.18 | 13,560.18 | 16,440.18 |
| Pretax income | 295.57 | 12,424.51 | 17,799.42 |
| Tax provision | 59.11 | 2,484.90 | 3,559.88 |
| Operating project cash flow | 236.46 | 9,939.61 | 14,239.54 |

Source: supplied workbook and scenario snapshot, independently recalculated by the accompanying script. Calculations retain unrounded values.

## NPV, break-even, payback and funding

`NPV = -initial expense + CF1/1.25 + CF2/1.25^2 + CF3/1.25^3`.

The 25% annual rate is the midpoint of the course's required 20–30% venture range and reflects the scenario's unvalidated commercial assumptions. Annual cash is discounted at year end. No terminal value or financing receipt enters project NPV.

In case 8, NPV is **$4,700.98**. Year 3 operating break-even is `ceil(1,370.014630 / 46) = 30` fully billed teams. This is a monthly operating-cost boundary, not recovery of the initial investment. Cumulative undiscounted project cash first becomes nonnegative in **month 22**.

Peak cumulative cash need is **$11,466.47**, including the initial expense. Add the three-month Year 1 fixed-cost reserve of **$2,670.04**, then round upward to the next $100: `ceil((11,466.467480 + 2,670.043889)/100) × 100 = $14,200`. The reserve is a funding buffer and is not charged again as an NPV expense. This amount funds the 36-month conditional schedule; it does not fund every downside case.

The continuous NPV-zero threshold is **3.4740111185** new paid teams per month. Three give NPV **−$4,279.05**; four give **+$4,700.98**. Therefore four is the smallest constant whole-number addition with positive NPV under the other stated inputs. It requires 144 new paying teams across 36 months before churn; solving the equation does not prove that the required acquisition channel exists.

## Sensitivity results

| Case | Scenario | Three-year NPV, USD | Funding incl. reserve, USD | Payback month |
|---|---|---:|---:|---|
| 1 | Cross-study illustration | −32,337.81 | 48,400 | Beyond 36 |
| 2 | Zero sales | −34,780.20 | 52,500 | Beyond 36 |
| 3 | Cross-study funnel at $59/hour | −59,624.65 | 92,100 | Beyond 36 |
| 4 | Cross-study funnel at $40/month | −32,815.67 | 49,200 | Beyond 36 |
| 5 | No retention | −34,645.95 | 52,300 | Beyond 36 |
| 6 | Archived original targets | −13,743.86 | 21,000 | Beyond 36 |
| 7 | Full retention, cross-study funnel | −30,947.07 | 45,900 | Beyond 36 |
| 8 | Conditional launch: four new teams/month | +4,700.98 | 14,200 | 22 |
| 9 | Conditional launch at $59/hour | −21,712.45 | 30,200 | Beyond 36 |
| 10 | Conditional launch at $40/month | −2,316.59 | 14,800 | 31 |

Source: the supplied ten-case snapshot and accompanying recalculation. Cases 9 and 10 keep acquisition and retention equal to case 8. The price case does not estimate demand elasticity. Case 10 recovers nominal investment within 36 months but still has negative NPV: nominal payback and meeting a 25% return hurdle answer different questions.

The revised financial result supports development only if acquisition, retention, price and costs satisfy the stated conditions. A positive conditional NPV does not establish demand, production security, legal permission or investment readiness. Related risk and investor-return calculations are documented in [risk-and-investor-review.md](risk-and-investor-review.md).
