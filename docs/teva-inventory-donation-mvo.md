# Teva Excess Inventory Donation — Minimum Viable Outcome (MVO)

**Status:** Draft for problem-definition workshop
**Owner:** Eli Leshem (Product)
**Principle:** Prove one outcome before building any agent. The four capabilities (Discover, Match, Execute, Measure) are the *eventual* system, not the starting point.

---

## 1. What "MVO" means here

The smallest **measurable business outcome** that proves the problem is real, the data is usable, and an agent would change a decision people actually make today.

Not a minimum product. Not four agents. One decision, one market, one product family, one number that moves.

---

## 2. The outcome we are buying

> **Inventory that would have expired or been destroyed is identified early enough to be donated, and we can prove it.**

Everything else (matching quality, execution speed, impact reporting) is downstream of this. If we cannot find excess inventory early, nothing else in the chain matters.

---

## 3. Problem statement (restated for the MVO)

Today, donation opportunities are found too late, evaluated manually, executed slowly across many stakeholders, and measured in fragments. As a result Teva loses patient impact, sustainability credit, cost avoidance, employee time, and executive visibility.

**MVO framing:** *Transform excess inventory from a loss-management process into a patient-impact and sustainability engine — starting with proving we can see it in time.*

---

## 4. The five decision bottlenecks, and which one we attack first

| # | Decision that takes too long today | Owner | MVO? |
|---|---|---|---|
| 1 | Which inventory is suitable for donation? | Supply chain / QA | **Yes — primary** |
| 2 | Which NGO or humanitarian request is the best match? | Global health / CSR | Partial — ranked shortlist only |
| 3 | What approvals are still missing? | Legal / Regulatory / Finance | No — track manually in pilot |
| 4 | What actions are blocking shipment? | Logistics | No |
| 5 | What impact was created after donation? | CSR / Finance | Minimal — one hand-built impact line per donation |

**Why #1 first:** expiry is irreversible. Every other bottleneck can be slow and still recover value. Missed discovery cannot.

---

## 4a. As-is process mapping (Path A — Teva-initiated)

Source: Path A swimlane, as-is. Steps A-03, A-04 and A-06 are absent from the diagram; confirm whether they were removed or live in Path B.

| Step | Owner lane | Tooling today | What it tells us |
|---|---|---|---|
| A-01 Opportunity Detection | AtM Program Mgr | IAR Power BI / Excel tracker | Detection is pull-based and owned by the programme, not by the people who hold the stock. Supply chain is not in the loop until A-07. |
| A-02-1 Financial impact | Finance & Tax | Tax file, PLM | Three assessments run in parallel, each in a different file, all needed before the gate. |
| A-02-2 Patient reach | Medical Affairs | Patient reach model | Same. |
| A-02-3 Environmental impact | ESG | Impact data, file TBD | The data source does not exist yet. Likely the slowest of the three and the one most often skipped. |
| Gate: Proceed? | Finance + Supply Chain leadership | Meeting / email | First decision point, reached only after all three assessments. |
| A-05 Case initiation | AtM | Email template to market | Hand-off by email. |
| A-07 Offer preparation | Teva market | Material Data Sheet | First time the market touches the case. |
| A-08 Offer submission | AtM | Email to Direct Relief | Single NGO partner. |
| A-09 DR accepts? | Direct Relief | Their call | Acceptance is decided after all Teva-side work is done. |
| A-09b Allowed? | Global Compliance + market + DR | Manual review | Compliance is also decided last. |
| A-10 Shipment | Teva entity + DR | Manual coordination | |
| A-11 Closure & impact | AtM | Fin / patient / env package | Re-assembles the same three A-02 assessments by hand. |

### What the as-is changes in the MVO

1. **The NGO is already fixed.** Direct Relief is the only recipient in Path A, so "Agent 2: Matching" is not a Path A problem. The real matching question is "will DR accept this?" and it is asked at A-09, after every upstream step. Matching in this MVO becomes a **pre-screen at A-01** against DR's current needs list, not a multi-NGO recommender. Multi-NGO matching belongs to Path B (NGO-initiated requests), if it exists.
2. **Two late gates create the waste.** A-09 (DR accepts) and A-09b (compliance) sit at the end. Every rejection there throws away three assessments, a leadership gate, a market hand-off and an offer. The MVO should count how often that happens. If it is frequent, moving a light DR-fit and compliance check to A-01 is a bigger win than faster detection.
3. **Detection sits with the wrong lane.** A-01 is owned by AtM working from an IAR report and an Excel tracker. Supply chain, who see stock ageing first, only appear at A-07. The MVO candidate list should be delivered to the supply chain lane and the AtM PM together, at A-01.
4. **A-11 is free if A-02 is captured properly.** The closure package is the three assessments re-typed. If the MVO logs A-02 outputs in one structured record per case, "Agent 4: Impact" is a report, not an agent.
5. **The environmental data file is a blocker, not a feature.** A-02-3 says "file TBD". Until that exists the sustainability figure in the value line is an estimate. Say so on the readout slide rather than hide it.

### Metrics to add from the as-is

| Metric | Where measured | Why |
|---|---|---|
| Days from IAR flag to Gate decision | A-01 to Gate | Direct measure of how long the three assessments take |
| Days from Gate to A-08 submission | Gate to A-08 | Hand-off latency through A-05 and A-07 |
| % of cases rejected at A-09 or A-09b | A-09, A-09b | Wasted upstream work; the case for pre-screening |
| % of cases with no environmental figure | A-02-3 | Data gap size |

### Revised MVO scope, one line

> At A-01, give the AtM PM and the site supply chain lead a weekly ranked list of at-risk stock that is pre-screened for DR fit and obvious compliance blockers, and log every case from A-01 to Gate in one record so A-11 becomes a query.

---

## 5. Hypothesis

> If supply chain and CSR see a weekly, ranked list of donation-eligible inventory **at least N days before the current identification point**, then the share of that inventory donated (vs. written off / destroyed) will rise measurably within one pilot cycle.

N and the baseline are unknown today. Establishing them is the first deliverable, not the agent.

---

## 6. Scope

### In scope
- **One market or distribution site** (pick one with a known write-off history and a willing site lead).
- **One product family** with clear donation eligibility rules (avoid controlled substances, cold chain, and narrow-regulation products for the pilot).
- **Direct Relief as the single recipient**, matching Path A as-is; use their current needs list for the pre-screen.
- **One agent capability:** Opportunity Discovery (Agent 1) at step A-01, delivering a weekly ranked list of donation candidates pre-screened for DR fit and obvious compliance blockers, with rationale.
- **Human decision loop:** a named person approves or rejects each candidate; the agent recommends, people decide.
- **Manual execution and manual impact line:** approvals, documentation, logistics, and the impact figure are done by hand and logged in a shared tracker.

### Out of scope (deliberately)
- Automated NGO matching across many partners (Path B territory, not Path A).
- Approval orchestration, reminders, or risk alerts.
- Logistics milestone tracking.
- Executive dashboard or automated value reporting.
- Any market where donation regulation is untested.

---

## 7. What the MVO agent actually does

**Inputs (minimum viable data)**
- Inventory positions with batch, quantity, expiry date, and location.
- Donation eligibility rules for the chosen market and product family (a short, human-written rule set).
- Existing write-off / destruction records for the last 12 months (for the baseline).
- The partner NGO's current needs list (a spreadsheet is fine).

**Output**
- A weekly list: product, batch, quantity, days to expiry, eligibility check result, a match score against the NGO needs list, and a one-paragraph rationale.
- A flag for anything that will cross the "too late to donate" threshold within the next cycle.

**Explicitly not doing**
- Sending anything to the NGO.
- Triggering approvals.
- Changing inventory status in any system of record.

---

## 8. Success metrics

Baseline all of these in weeks 1–2 before the agent runs.

| Metric | Type | Baseline | Target |
|---|---|---|---|
| Median days between "excess identified" and expiry | Leading | TBD | +N days earlier |
| % of eligible excess units donated vs. destroyed | Lagging | TBD | measurable increase |
| Analyst hours per donation evaluation | Leading | TBD | reduction |
| Candidate list precision (accepted / recommended) | Quality | n/a | ≥ 70% |
| Value line per donation (cost avoided, units, est. patients) | Proof | fragmented | 100% of pilot donations |

The headline number for executives is the second row. The other four explain why it moved.

---

## 9. Roles (human-in-the-loop)

| Role | Responsibility in pilot |
|---|---|
| Site supply chain lead | Validates candidate list weekly; owns the accept / reject decision |
| QA / Regulatory | Confirms eligibility rules; reviews rejected-for-compliance cases |
| CSR / Global health | Owns the NGO relationship and the needs list |
| Finance | Provides cost-avoidance method for the value line |
| Product (Eli) | Owns hypothesis, metrics, and the go / no-go call |

---

## 10. Timeline (8 weeks)

| Weeks | Activity |
|---|---|
| 1–2 | Baseline: pull 12 months of write-off data, measure current identification lead time, agree eligibility rules |
| 3 | Build the weekly candidate list (can be a query + Copilot prompt, not a full agent) |
| 4–7 | Run four weekly cycles with the human decision loop; log every decision and outcome |
| 8 | Readout: metrics vs. baseline, go / no-go on Agent 2 |

---

## 11. Go / no-go criteria

**Continue to Agent 2 (Matching)** if:
- Identification moved earlier by a meaningful margin against baseline.
- At least one donation happened that the site lead confirms would otherwise have been destroyed.
- The candidate list precision is above threshold and the site lead wants to keep using it.

**Stop or redesign** if:
- Inventory data quality prevents reliable expiry / eligibility checks (this is a data problem, not an agent problem).
- Candidates are found early but donations still do not happen — the bottleneck is approvals or logistics, so the next build target changes to Agent 3.
- The site lead does not act on the list — the problem is incentives or ownership, not information.

The third failure mode is the most likely and the most important to detect early.

---

## 12. Sequencing after the MVO

1. **Agent 1 — Opportunity Discovery** (this MVO)
2. **Agent 2 — Matching**, only once there are more candidates than one NGO can absorb
3. **Agent 3 — Execution**, only once discovery + matching produce more approved donations than the manual process can execute
4. **Agent 4 — Impact**, only once there are enough completed donations that a manual value line is no longer sustainable

Each agent is justified by the previous one creating a new bottleneck.

---

## 13. Questions to answer in the workshop before anything is built

The single framing question:

> **"What prevents Teva from consistently finding excess inventory early, matching it quickly, executing it efficiently, and proving its impact today?"**

Supporting questions, one per bottleneck:

1. Where does "excess" first become visible in our systems, and who sees it?
2. How is donation eligibility decided today, and is it written down?
3. Which approvals are needed, in what order, and which one is slowest?
4. Where do shipments stall, and who is chasing them?
5. What number does leadership want to see, and what would they do differently if they saw it?

If the workshop cannot answer question 1 with a specific system, role, and lead time, the MVO starts with a data audit rather than an agent.
