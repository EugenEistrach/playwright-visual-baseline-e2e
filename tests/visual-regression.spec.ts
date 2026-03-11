import { expect, test } from '@playwright/test';

const variant = process.env.VISUAL_VARIANT?.trim() || 'v1';

test('marketing card visual regression @visual @smoke', async ({ page }, testInfo) => {
  testInfo.annotations.push({ type: 'visual-variant', description: variant });

  await page.setContent(renderVisualFixture(variant), { waitUntil: 'domcontentloaded' });

  const card = page.locator('[data-visual-root]');

  await expect(card).toHaveScreenshot('marketing-card.png', {
    animations: 'disabled',
    caret: 'hide'
  });
});

function renderVisualFixture(currentVariant: string): string {
  const accent = currentVariant === 'v2' ? '#f97316' : '#0f766e';
  const badgeText = currentVariant === 'v2' ? 'Variant Two' : 'Variant One';
  const heading = currentVariant === 'v2' ? 'Lift planning, revised.' : 'Lift planning, stable.';
  const body =
    currentVariant === 'v2'
      ? 'The visual diff should catch the brighter palette, sharper badge, and reordered metrics.'
      : 'This baseline establishes the calm palette, softer badge, and original metric arrangement.';
  const metrics =
    currentVariant === 'v2'
      ? [
          ['Visual drift', 'Detected'],
          ['Promotions', 'Enabled'],
          ['Approval', 'Ready']
        ]
      : [
          ['Baseline', 'Missing'],
          ['Promotions', 'Pending'],
          ['Approval', 'Queued']
        ];

  const metricMarkup = metrics
    .map(
      ([label, value]) => `
        <div class="metric">
          <span class="metric-label">${label}</span>
          <strong class="metric-value">${value}</strong>
        </div>
      `
    )
    .join('');

  return `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>Visual Fixture</title>
        <style>
          :root {
            color-scheme: light;
            font-family: "Avenir Next", "Segoe UI", sans-serif;
            background: #f7f4ec;
          }

          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            min-height: 100vh;
            display: grid;
            place-items: center;
            background:
              radial-gradient(circle at top left, rgba(15, 118, 110, 0.12), transparent 28%),
              linear-gradient(160deg, #f8f5ee 0%, #f1ece1 100%);
          }

          .card {
            width: 760px;
            padding: 48px;
            border-radius: 28px;
            background: rgba(255, 255, 255, 0.9);
            border: 1px solid rgba(15, 23, 42, 0.08);
            box-shadow: 0 24px 90px rgba(15, 23, 42, 0.12);
          }

          .eyebrow {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            padding: 10px 16px;
            border-radius: 999px;
            background: ${currentVariant === 'v2' ? 'rgba(249, 115, 22, 0.14)' : 'rgba(15, 118, 110, 0.14)'};
            color: ${accent};
            font-size: 13px;
            font-weight: 700;
            letter-spacing: 0.08em;
            text-transform: uppercase;
          }

          .dot {
            width: 10px;
            height: 10px;
            border-radius: 999px;
            background: ${accent};
            box-shadow: 0 0 0 6px ${currentVariant === 'v2' ? 'rgba(249, 115, 22, 0.12)' : 'rgba(15, 118, 110, 0.12)'};
          }

          h1 {
            margin: 26px 0 14px;
            font-size: 48px;
            line-height: 1.02;
            color: #111827;
          }

          p {
            margin: 0;
            max-width: 620px;
            font-size: 18px;
            line-height: 1.6;
            color: #475569;
          }

          .metrics {
            margin-top: 34px;
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 16px;
          }

          .metric {
            padding: 18px 20px;
            border-radius: 20px;
            background: ${currentVariant === 'v2' ? 'linear-gradient(180deg, rgba(255,247,237,1) 0%, rgba(255,237,213,0.95) 100%)' : 'linear-gradient(180deg, rgba(240,253,250,1) 0%, rgba(204,251,241,0.95) 100%)'};
            border: 1px solid ${currentVariant === 'v2' ? 'rgba(249, 115, 22, 0.18)' : 'rgba(13, 148, 136, 0.18)'};
          }

          .metric-label {
            display: block;
            margin-bottom: 8px;
            font-size: 12px;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            color: #64748b;
          }

          .metric-value {
            font-size: 24px;
            color: #0f172a;
          }
        </style>
      </head>
      <body>
        <main class="card" data-visual-root>
          <div class="eyebrow"><span class="dot"></span>${badgeText}</div>
          <h1>${heading}</h1>
          <p>${body}</p>
          <section class="metrics">${metricMarkup}</section>
        </main>
      </body>
    </html>
  `;
}
