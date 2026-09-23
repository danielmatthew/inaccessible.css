# inaccessible.css

[![npm](https://img.shields.io/npm/v/inaccessible.css?style=for-the-badge)](https://www.npmjs.com/package/inaccessible.css)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=for-the-badge)](https://github.com/semantic-release/semantic-release)

A drop-in stylesheet that highlights inaccessible markup while you develop. Problems get an obnoxious outline:

- **Red** for errors: markup that fails WCAG.
- **Orange** for warnings: markup that is usually a problem but might be fine in context.

Where the browser allows it, a short label also explains the problem, for example "Label not linked to a control". Images, form fields, frames and video can't show these labels, so they only get an outline.

It's a quick visual check, not a replacement for an automated audit (such as axe) or testing with real assistive technology. Some checks can't be done in CSS, such as checking that a `<label for>` points at an element that exists.

## Usage

### CSS
Add the stylesheet after your own styles, during development only:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/inaccessible.css/dist/inaccessible.min.css">
```

Or install it with `npm install --save-dev inaccessible.css` and link to `node_modules/inaccessible.css/dist/inaccessible.css`.

### SCSS

```scss
@use 'inaccessible.css/src/scss/inaccessible';
```

The `inaccessible($level, $message)` mixin is forwarded too, so you can add your own checks:

```scss
@use 'inaccessible.css/src/scss/inaccessible' as a11y;

.legacy-widget:not([role]) {
  @include a11y.inaccessible(warning, 'Widget has no role');
}
```

### Customising
Every setting is a CSS custom property, so you can change it without Sass:

```css
:root {
  --inaccessible-error: magenta;
  --inaccessible-warning: gold;
  --inaccessible-width: 4px;
  --inaccessible-offset: 1px;
  --inaccessible-message-display: none; /* hide the text labels */
}
```

## Browser support
Several checks use `:has()`, which is supported by all major browsers released since December 2023.

## What it checks

### Errors
| Check | WCAG |
|---|---|
| `<html>` without a `lang`, or with an empty one | 3.1.1 |
| Document without a `<title>`, or with an empty one | 2.4.2 |
| Viewport `<meta>` that stops people zooming in (`user-scalable=no`/`0`, `maximum-scale=1`) | 1.4.4 |
| `<meta http-equiv="refresh">` with a delay | 2.2.1 |
| `<img>` without `alt`. `<input type="image">` or `[role="img"]` without an accessible name | 1.1.1 |
| `<iframe>` without a `title` | 4.1.2 |
| `<video>` without a captions or subtitles `<track>` | 1.2.2 |
| `<audio autoplay>`, or `<video autoplay>` that isn't `muted`. `autoplay="false"` still autoplays | 1.4.2 |
| `<marquee>` and `<blink>` | 2.2.2 |
| `<label>` that neither has `for` nor wraps a control | 1.3.1 |
| Input, select or textarea with no `id`, `aria-label`, `aria-labelledby` or `title`, and not inside a `<label>` | 4.1.2 |
| Empty links, buttons and headings | 2.4.4, 2.4.6, 4.1.2 |
| Positive `tabindex` | 2.4.3 |
| Focusable content inside `aria-hidden="true"` | 4.1.2 |

### Warnings
| Check | Why |
|---|---|
| `<a>` without an `href`, or with `href="#"` or `javascript:` | Probably should be a `<button>` |
| `<video autoplay muted>` without `controls` | Moving content can't be paused (2.2.2) |
| `<table>` without any `<th>` | Data tables need headers (1.3.1). Mark layout tables with `role="presentation"` |
| `<fieldset>` without a `<legend>` | The group has no name (1.3.1) |
| Anything other than `<li>` inside `<ul>` or `<ol>` | Invalid list structure (1.3.1) |
| `accesskey` | Clashes with assistive technology shortcuts |
| `autofocus` | Can disorient screen reader and magnifier users |
| Inline `onclick` on an element that isn't interactive | Probably can't be used with a keyboard (2.1.1) |

## Development

```sh
npm install
npm start   # rebuild dist/inaccessible.css on change
npm test    # build, then check every example in demo/ in Chromium
```

The pages in `demo/` are both the demo and the test fixtures. Each example has a `data-expect="error|warning|none"` attribute, and the tests fail if any element is highlighted differently. If you add a check, add passing and failing examples there.

Commits follow [Conventional Commits](https://www.conventionalcommits.org/), which semantic-release uses to version and publish from `main`.
