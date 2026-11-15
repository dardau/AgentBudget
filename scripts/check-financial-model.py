"""Recalculate the supplied AgentBudget financial scenarios using only Python 3.

Run from the repository root: python3 scripts/check-financial-model.py
The JSON reference records supplied results, not observed customer demand.
"""
import json
import math
from pathlib import Path


def project(case, additions=None):
    rate = 59 if case in (3, 9) else 30
    price = 40 if case in (4, 10) else 49
    survival = {5: 0, 6: 0.98, 7: 1}.get(case, 0.55 ** (1 / 12))
    legal_hour = 60000 / 444.3
    initial = 120 * rate + 5000 + 4 * legal_hour
    balance = -initial
    balances = [balance]
    customers = 0
    payback = None
    annual = [[] for _ in range(8)]
    for year, candidates in enumerate((32, 48, 64), start=1):
        new = (4 if case >= 8 else candidates * (0.30 * 0.5 * 0.25 if case == 6 else 0.03 * 0.182))
        if case == 2:
            new = 0
        if additions is not None:
            new = additions
        fixed = (12 + candidates / 2) * rate + 5 + legal_hour / 3
        totals = [0.0] * 7
        for within_year in range(1, 13):
            retained = customers * survival
            billed = retained + new / 2
            customers = retained + new
            revenue = billed * price
            support = billed * rate / 10
            profit = revenue - support - fixed
            totals[3] += profit
            tax = max(totals[3], 0) * 0.20 if within_year == 12 else 0
            flow = profit - tax
            for index, value in enumerate((revenue, support, fixed, 0, tax, flow, billed)):
                totals[index] += value
            balance += flow
            balances.append(balance)
            if payback is None and balance >= 0:
                payback = (year - 1) * 12 + within_year
        for index, value in enumerate(totals):
            annual[index].append(value)
        annual[7].append(customers)
    reserve = 3 * ((12 + 32 / 2) * rate + 5 + legal_hour / 3)
    peak = -min(balances)
    return dict(initial=initial, annual=annual, npv=-initial + sum(
        flow / 1.25 ** year for year, flow in enumerate(annual[5], start=1)),
        peak=peak, reserve=reserve, funding=math.ceil((peak + reserve) / 100) * 100,
        endCash=balance, breakEven=math.ceil(fixed / (price - rate / 10)), payback=payback)


def compare(actual, expected, label, tolerance):
    if isinstance(expected, list):
        if len(actual) != len(expected):
            raise ValueError(f"{label}: inconsistent number of periods")
        return max((compare(a, b, f"{label}[{i}]", tolerance)
                    for i, (a, b) in enumerate(zip(actual, expected))), default=0)
    if expected is None or isinstance(expected, int):
        if actual != expected:
            raise ValueError(f"{label}: {actual!r} != {expected!r}")
        return 0
    difference = abs(actual - expected)
    if not math.isfinite(actual) or difference > tolerance:
        raise ValueError(f"{label}: difference {difference} exceeds {tolerance}")
    return difference


def main():
    reference = json.loads((Path(__file__).resolve().parents[1] /
                            "finance/scenario-reference.json").read_text())
    tolerance = reference["tolerance"]
    maximum = 0.0
    print("Case | NPV USD | Funding USD | Payback month")
    for expected in reference["cases"]:
        actual = project(expected["case"])
        for key, value in actual.items():
            maximum = max(maximum, compare(value, expected[key],
                          f"case {expected['case']} {key}", tolerance))
        print(f"{expected['case']:>4} | {actual['npv']:>10.2f} | "
              f"{actual['funding']:>11} | {actual['payback'] or '>36'}")
    low, high = 0.0, 16.0
    for _ in range(80):
        midpoint = (low + high) / 2
        if project(8, additions=midpoint)["npv"] > 0:
            high = midpoint
        else:
            low = midpoint
    root = (low + high) / 2
    compare(root, reference["launch_threshold"], "launch threshold", tolerance)
    compare(project(8, additions=root)["npv"], 0.0, "NPV at threshold", tolerance)
    if not project(8, additions=3)["npv"] < 0 < project(8, additions=4)["npv"]:
        raise ValueError("The whole-number launch boundary is inconsistent")
    print(f"PASS: 10 scenarios; maximum numeric difference {maximum:.3g} USD.")
    print(f"PASS: NPV=0 at {root:.10f} new teams/month; whole-number target 4.")


if __name__ == "__main__":
    main()
