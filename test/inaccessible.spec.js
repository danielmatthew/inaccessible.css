const { test, expect } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');

const demo = path.join(__dirname, '..', 'demo');
const pages = fs.readdirSync(demo).filter((file) => file.endsWith('.html'));
const url = (file) => `file://${path.join(demo, file)}`;

// Runs in the page: what each element should show and what it does show.
function inspect() {
  const levels = { 'rgb(208, 0, 0)': 'error', 'rgb(230, 126, 0)': 'warning' };

  return [...document.querySelectorAll('*')].map((el) => {
    const style = getComputedStyle(el);
    const outlined = style.outlineStyle !== 'none' && parseFloat(style.outlineWidth) > 0;
    return {
      html: el.outerHTML.split('>')[0].slice(0, 120) + '>',
      expected: el.dataset.expect ?? 'none',
      actual: outlined ? levels[style.outlineColor] ?? `other (${style.outlineColor})` : 'none',
      message: el.dataset.message,
      after: getComputedStyle(el, '::after').content,
    };
  });
}

for (const file of pages) {
  test(`${file}: every element is highlighted as expected`, async ({ page }) => {
    await page.goto(url(file));
    const elements = await page.evaluate(inspect);

    const wrong = elements
      .filter(({ expected, actual }) => expected !== actual)
      .map(({ html, expected, actual }) => `${html} expected ${expected}, got ${actual}`);
    expect(wrong).toEqual([]);

    const messages = elements
      .filter(({ message, after }) => message && after !== `"${message}"`)
      .map(({ html, message, after }) => `${html} expected "${message}", got ${after}`);
    expect(messages).toEqual([]);
  });
}

test('outline resets on the page do not hide highlights', async ({ page }) => {
  await page.goto(url('index.html'));
  await page.addStyleTag({ content: '*, *:focus { outline: 0; outline-offset: 0; }' });
  const outline = await page.$eval('img:not([alt])', (el) => getComputedStyle(el).outlineStyle);
  expect(outline).toBe('solid');
});

test('colours, width and messages can be customised with CSS variables', async ({ page }) => {
  await page.goto(url('index.html'));
  await page.addStyleTag({
    content: ':root { --inaccessible-error: rgb(0, 0, 255); --inaccessible-width: 5px; --inaccessible-message-display: none; }',
  });

  const img = await page.$eval('img:not([alt])', (el) => {
    const { outlineColor, outlineWidth } = getComputedStyle(el);
    return { outlineColor, outlineWidth };
  });
  expect(img).toEqual({ outlineColor: 'rgb(0, 0, 255)', outlineWidth: '5px' });

  const display = await page.$eval('button:empty', (el) => getComputedStyle(el, '::after').display);
  expect(display).toBe('none');
});
