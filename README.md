# inaccessible.css

![NPM Version 1.2.0](https://img.shields.io/npm/v/inaccessible.css?style=for-the-badge)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=for-the-badge)](https://github.com/semantic-release/semantic-release)

A stylesheet to highlight inaccessible markup. It'll add an obnoxious red outline around elements which are lacking important attributes.

## Violations
The stylesheet will highlight the following accessibility mistakes:

- Document missing the `lang`
- Images missing an `alt`
- Labels without a `for`
- Links without an `href`
- iframes without a `title`

## Usage
### CSS
Add `inaccessible.css` to the document head:

```html
<link href="inacessible.css" rel="stylesheet">
```

### SCSS
Import `inaccessible.scss` into your stylesheet:

```scss
@import 'inaccessible';

body { … }
```
