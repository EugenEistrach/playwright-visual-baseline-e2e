# Playwright Visual Baseline E2E

Minimal Playwright fixture repo for validating visual baseline flows in `ecom_toolkit_v2`.

## Behavior

- `VISUAL_VARIANT=v1` renders the baseline state
- `VISUAL_VARIANT=v2` renders a deliberate visual regression
- No baseline snapshots are committed initially

## Local usage

```bash
npm install
npx playwright test
```

Create snapshots manually:

```bash
VISUAL_VARIANT=v1 npx playwright test --update-snapshots
```
