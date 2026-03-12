# Playwright Visual Baseline E2E

Minimal Playwright fixture repo for validating visual baseline flows in `ecom_toolkit_v2`.

## Behavior

- No baseline snapshots are committed initially
- `VISUAL_VARIANT=v1` renders the baseline candidate set you can promote
- `VISUAL_VARIANT=v2` renders a mixed run:
  - multiple visual diffs in a single Playwright test
  - a mobile-shaped snapshot
  - a taller snapshot with extra content
  - a v2-only snapshot that becomes a `new baseline` candidate

## Local usage

```bash
npm install
npx playwright test
```

Refresh the baseline snapshots manually:

```bash
VISUAL_VARIANT=v1 npx playwright test --update-snapshots
```

Exercise the app flow:

```bash
# 1. Run with v1 and promote all three baselines in the app
# 2. Switch the suite to v2
# 3. Re-run to get three diffs plus one new baseline
```

Generate the mismatch run locally:

```bash
VISUAL_VARIANT=v2 npx playwright test
```
