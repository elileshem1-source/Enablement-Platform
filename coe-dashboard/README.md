# Digital Workforce CoE Scorecard

This single-page app tracks the team's 2026 KPIs against the six Digital Workforce goals. It uses Teva branding.

## Views
- **Team overview**: overall attainment vs. pace, the six goal scorecards, progress trend, KPI health mix, a member × goal heatmap, team cards and the latest updates.
- **Internal KPIs** / **External KPIs**: two separate dashboards with tiles, progress by goal (vs. expected pace), status by member, and a sortable KPI table or card grid with sparklines. Click any KPI to open its detail drawer.
- **Update my KPIs**: each member picks their name and edits Q1–Q4 actuals, baseline, target, unit, goal alignment and a note. The app previews the new status before you save. Saved values show up on every dashboard right away. Members can also add or delete KPIs.

## Filters
Filter by team member, goal, status, as-of quarter and free-text search, and hide sample values. Clicking a goal card, a heatmap cell or a member's "View KPIs" button also sets the filters.

## How status works
- Progress = (latest − baseline) ÷ (target − baseline)
- Expected = quarter of latest reading ÷ 4
- Achieved ≥ 100% · On track: pace ≥ 90% · At risk: ≥ 70% · Off track: < 70%

## Data
- The catalog contains all 69 KPIs the team supplied. **Targets and baselines are proposals**, and the Q1–Q3 values are **illustrative samples** marked with a SAMPLE tag. They clear KPI by KPI as owners save real values. Settings → "Clear all sample values" removes all of them at once.
- When the app is published as a claude.ai artifact, it saves to a shared live database. Everyone who opens it sees the same data.
- When you open the file directly in a browser, it saves to that browser only. Use Export JSON / Import JSON to move snapshots between browsers. CSV export is always available.
- You can rename the goals in Settings.
