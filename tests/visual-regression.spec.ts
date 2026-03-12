import { expect, test } from '@playwright/test';

const variant = process.env.VISUAL_VARIANT?.trim() || 'v1';

test('visual gallery regression @visual @smoke', async ({ page }, testInfo) => {
  testInfo.annotations.push({ type: 'visual-variant', description: variant });

  await page.setContent(renderVisualFixturePage(variant), { waitUntil: 'domcontentloaded' });

  await expect.soft(page.locator('[data-visual-root="marketing-card"]')).toHaveScreenshot(
    'marketing-card.png',
    screenshotOptions()
  );

  await expect.soft(page.locator('[data-visual-root="release-timeline"]')).toHaveScreenshot(
    'release-timeline.png',
    screenshotOptions()
  );

  await expect.soft(page.locator('[data-visual-root="mobile-status"]')).toHaveScreenshot(
    'mobile-status.png',
    screenshotOptions()
  );

  if (variant === 'v2') {
    await expect.soft(page.locator('[data-visual-root="insight-feed"]')).toHaveScreenshot(
      'insight-feed.png',
      screenshotOptions()
    );
  }
});

function screenshotOptions() {
  return {
    animations: 'disabled' as const,
    caret: 'hide' as const
  };
}

function renderVisualFixturePage(currentVariant: string): string {
  const includeInsightFeed = currentVariant === 'v2';

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
            background: #f6f2e8;
          }

          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            padding: 48px 24px 72px;
            background:
              radial-gradient(circle at top left, rgba(15, 118, 110, 0.12), transparent 24%),
              radial-gradient(circle at bottom right, rgba(180, 83, 9, 0.1), transparent 22%),
              linear-gradient(180deg, #f8f4ec 0%, #f1eadf 100%);
          }

          .stack {
            width: min(1040px, 100%);
            margin: 0 auto;
            display: grid;
            gap: 28px;
            justify-items: center;
          }

          .surface {
            overflow: hidden;
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
            font-size: 13px;
            font-weight: 700;
            letter-spacing: 0.08em;
            text-transform: uppercase;
          }

          .dot {
            width: 10px;
            height: 10px;
            border-radius: 999px;
          }

          .metric-grid {
            display: grid;
            gap: 16px;
          }

          .metric {
            padding: 18px 20px;
            border-radius: 20px;
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

          .timeline {
            display: grid;
            gap: 14px;
          }

          .timeline-row {
            display: grid;
            grid-template-columns: 96px minmax(0, 1fr);
            gap: 16px;
            align-items: start;
          }

          .timeline-badge {
            padding-top: 4px;
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 0.08em;
            text-transform: uppercase;
          }

          .timeline-card {
            border-radius: 22px;
            padding: 18px 20px;
          }

          .timeline-card h3 {
            margin: 0 0 8px;
            font-size: 22px;
            color: #0f172a;
          }

          .timeline-card p {
            margin: 0;
            font-size: 15px;
            line-height: 1.55;
            color: #475569;
          }

          .mobile-frame {
            width: 360px;
            padding: 18px;
            border-radius: 34px;
            background: linear-gradient(180deg, #111827 0%, #1e293b 100%);
            box-shadow: 0 28px 80px rgba(15, 23, 42, 0.28);
          }

          .mobile-inner {
            border-radius: 24px;
            padding: 18px;
            background: linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(248,250,252,0.92) 100%);
          }

          .status-list {
            display: grid;
            gap: 12px;
          }

          .status-card {
            border-radius: 18px;
            padding: 16px;
          }

          .status-card strong {
            display: block;
            margin-bottom: 6px;
            font-size: 16px;
            color: #0f172a;
          }

          .status-card p {
            margin: 0;
            font-size: 13px;
            line-height: 1.5;
            color: #475569;
          }
        </style>
      </head>
      <body>
        <main class="stack">
          ${marketingCardMarkup(currentVariant)}
          ${releaseTimelineMarkup(currentVariant)}
          ${mobileStatusMarkup(currentVariant)}
          ${includeInsightFeed ? insightFeedMarkup() : ''}
        </main>
      </body>
    </html>
  `;
}

function marketingCardMarkup(currentVariant: string): string {
  const isChanged = currentVariant === 'v2';
  const accent = isChanged ? '#d97706' : '#0f766e';
  const badgeBg = isChanged ? 'rgba(217, 119, 6, 0.12)' : 'rgba(15, 118, 110, 0.14)';
  const badgeText = isChanged ? 'Variant Two' : 'Variant One';
  const heading = isChanged ? 'Lift planning, revised.' : 'Lift planning, stable.';
  const body = isChanged
    ? 'The visual diff should catch the brighter palette, sharper badge, and reordered metrics.'
    : 'This baseline establishes the calm palette, softer badge, and original metric arrangement.';

  const metrics = isChanged
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
        <div class="metric" style="background: ${
          isChanged
            ? 'linear-gradient(180deg, rgba(255,247,237,1) 0%, rgba(255,237,213,0.95) 100%)'
            : 'linear-gradient(180deg, rgba(240,253,250,1) 0%, rgba(204,251,241,0.95) 100%)'
        }; border: 1px solid ${isChanged ? 'rgba(249, 115, 22, 0.18)' : 'rgba(13, 148, 136, 0.18)'};">
          <span class="metric-label">${label}</span>
          <strong class="metric-value">${value}</strong>
        </div>
      `
    )
    .join('');

  return `
    <section
      class="surface"
      data-visual-root="marketing-card"
      style="width: 760px; padding: 48px;"
    >
      <div class="eyebrow" style="background: ${badgeBg}; color: ${accent};">
        <span class="dot" style="background: ${accent}; box-shadow: 0 0 0 6px ${badgeBg};"></span>
        ${badgeText}
      </div>
      <h1 style="margin: 26px 0 14px; font-size: 48px; line-height: 1.02; color: #111827;">${heading}</h1>
      <p style="margin: 0; max-width: 620px; font-size: 18px; line-height: 1.6; color: #475569;">${body}</p>
      <section class="metric-grid" style="margin-top: 34px; grid-template-columns: repeat(3, minmax(0, 1fr));">
        ${metricMarkup}
      </section>
    </section>
  `;
}

function releaseTimelineMarkup(currentVariant: string): string {
  const isChanged = currentVariant === 'v2';
  const rows = [
    ['08:30', 'Preview synced', 'All baseline screenshots regenerated against the latest branch.'],
    ['09:10', 'QA reviewed', 'Stable typography and card alignment confirmed across desktop breakpoints.'],
    ['10:05', 'Promotion ready', 'Visual artifacts prepared for baseline promotion and release sign-off.']
  ];

  if (isChanged) {
    rows.splice(1, 0, [
      '09:32',
      'Operator notes attached',
      'A new escalation note expands the layout height and forces a taller comparison frame.'
    ]);
  }

  const rowMarkup = rows
    .map(
      ([time, title, body], index) => `
        <div class="timeline-row">
          <div class="timeline-badge" style="color: ${isChanged ? '#b45309' : '#0f766e'};">${time}</div>
          <article
            class="timeline-card"
            style="background: ${
              index % 2 === 0
                ? isChanged
                  ? 'rgba(255, 247, 237, 0.92)'
                  : 'rgba(240, 253, 250, 0.92)'
                : 'rgba(255, 255, 255, 0.9)'
            }; border: 1px solid ${isChanged ? 'rgba(245, 158, 11, 0.2)' : 'rgba(45, 212, 191, 0.18)'};"
          >
            <h3>${title}</h3>
            <p>${body}</p>
          </article>
        </div>
      `
    )
    .join('');

  return `
    <section
      class="surface"
      data-visual-root="release-timeline"
      style="width: 820px; padding: 38px 40px 40px; background: ${
        isChanged
          ? 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,250,244,0.96) 100%)'
          : 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(244,251,250,0.96) 100%)'
      };"
    >
      <div class="eyebrow" style="background: ${isChanged ? 'rgba(245, 158, 11, 0.12)' : 'rgba(20, 184, 166, 0.12)'}; color: ${isChanged ? '#b45309' : '#0f766e'};">
        <span class="dot" style="background: ${isChanged ? '#f59e0b' : '#14b8a6'}; box-shadow: 0 0 0 6px ${
          isChanged ? 'rgba(245, 158, 11, 0.12)' : 'rgba(20, 184, 166, 0.12)'
        };"></span>
        Release Track
      </div>
      <h2 style="margin: 22px 0 10px; font-size: 34px; line-height: 1.08; color: #0f172a;">
        ${isChanged ? 'Promotion timeline expanded.' : 'Promotion timeline aligned.'}
      </h2>
      <p style="margin: 0 0 24px; font-size: 17px; line-height: 1.6; color: #475569; max-width: 680px;">
        ${isChanged
          ? 'A new operator-notes block makes this snapshot taller, which is useful for compare-mode stress testing.'
          : 'The baseline keeps a shorter sequence with compact cards and a calmer success palette.'}
      </p>
      <div class="timeline">${rowMarkup}</div>
    </section>
  `;
}

function mobileStatusMarkup(currentVariant: string): string {
  const isChanged = currentVariant === 'v2';

  const cards = isChanged
    ? [
        ['Visual drift', 'Detected on mobile after the palette flip and badge emphasis.'],
        ['Review lane', 'Escalated for sign-off before promotion proceeds.'],
        ['Publish window', 'Ready once revised cards are approved.']
      ]
    : [
        ['Baseline state', 'Captured for the original compact mobile summary.'],
        ['Review lane', 'Queued for design verification after the first pass.'],
        ['Publish window', 'Pending baseline promotion and branch sync.']
      ];

  const cardMarkup = cards
    .map(
      ([title, body], index) => `
        <article
          class="status-card"
          style="background: ${
            index === 0
              ? isChanged
                ? 'rgba(255, 237, 213, 0.9)'
                : 'rgba(204, 251, 241, 0.9)'
              : 'rgba(255, 255, 255, 0.92)'
          }; border: 1px solid ${isChanged ? 'rgba(249, 115, 22, 0.18)' : 'rgba(13, 148, 136, 0.16)'};"
        >
          <strong>${title}</strong>
          <p>${body}</p>
        </article>
      `
    )
    .join('');

  return `
    <section data-visual-root="mobile-status">
      <div class="mobile-frame">
        <div class="mobile-inner">
          <div class="eyebrow" style="background: ${isChanged ? 'rgba(251, 191, 36, 0.16)' : 'rgba(45, 212, 191, 0.16)'}; color: ${isChanged ? '#b45309' : '#0f766e'};">
            <span class="dot" style="background: ${isChanged ? '#f59e0b' : '#14b8a6'}; box-shadow: 0 0 0 6px ${
              isChanged ? 'rgba(251, 191, 36, 0.18)' : 'rgba(45, 212, 191, 0.16)'
            };"></span>
            Mobile Summary
          </div>
          <h2 style="margin: 18px 0 8px; font-size: 28px; line-height: 1.08; color: #0f172a;">
            ${isChanged ? 'Shift lead needs review.' : 'Shift lead looks stable.'}
          </h2>
          <p style="margin: 0 0 18px; font-size: 14px; line-height: 1.55; color: #475569;">
            ${isChanged
              ? 'This snapshot keeps a narrow phone ratio while changing content density and the top card styling.'
              : 'The baseline is intentionally narrow so the compare UI gets a true mobile-shaped artifact.'}
          </p>
          <div class="status-list">${cardMarkup}</div>
        </div>
      </div>
    </section>
  `;
}

function insightFeedMarkup(): string {
  return `
    <section
      class="surface"
      data-visual-root="insight-feed"
      style="width: 720px; padding: 36px 38px 40px; background: linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(255,248,238,0.98) 100%);"
    >
      <div class="eyebrow" style="background: rgba(245, 158, 11, 0.12); color: #b45309;">
        <span class="dot" style="background: #f59e0b; box-shadow: 0 0 0 6px rgba(245, 158, 11, 0.12);"></span>
        New Snapshot
      </div>
      <h2 style="margin: 22px 0 10px; font-size: 34px; line-height: 1.08; color: #0f172a;">
        Insight feed introduced.
      </h2>
      <p style="margin: 0 0 24px; font-size: 17px; line-height: 1.6; color: #475569; max-width: 620px;">
        This panel only exists in variant two, so the app should surface it as a new baseline candidate instead of a compare mode.
      </p>
      <div style="display: grid; gap: 14px;">
        <article style="padding: 18px 20px; border-radius: 22px; background: rgba(255, 247, 237, 0.92); border: 1px solid rgba(249, 115, 22, 0.16);">
          <strong style="display: block; margin-bottom: 6px; font-size: 18px; color: #0f172a;">Variance cluster</strong>
          <p style="margin: 0; font-size: 15px; line-height: 1.55; color: #475569;">
            Newly grouped visual changes for the latest build train.
          </p>
        </article>
        <article style="padding: 18px 20px; border-radius: 22px; background: rgba(255, 255, 255, 0.94); border: 1px solid rgba(249, 115, 22, 0.12);">
          <strong style="display: block; margin-bottom: 6px; font-size: 18px; color: #0f172a;">Promotion queue</strong>
          <p style="margin: 0; font-size: 15px; line-height: 1.55; color: #475569;">
            Ready for the no-baseline path in run details.
          </p>
        </article>
      </div>
    </section>
  `;
}
