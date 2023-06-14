# @serguun42/pdf-parse

Fork of [pdf-parse](https://www.npmjs.com/package/pdf-parse)

## Installation

`npm install @serguun42/pdf-parse`

## Basic Usage - Local Files

```js
const fs = require("fs");
const PdfParse = require("@serguun42/pdf-parse");

let dataBuffer = fs.readFileSync("path/to/file.pdf");

PdfParse(dataBuffer).then((data) => {
	// number of pages
	console.log(data.numpages);
	// number of rendered pages
	console.log(data.numrender);
	// PDF info
	console.log(data.info);
	// PDF metadata
	console.log(data.metadata);
	// PDF.js version
	// check https://mozilla.github.io/pdf.js/getting_started/
	console.log(data.version);
	// PDF text
	console.log(data.text);
});
```

## Basic Usage - HTTP

You can use [crawler-request](https://www.npmjs.com/package/crawler-request) which uses the `pdf-parse`

## Exception Handling

```js
const fs = require("fs");
const PdfParse = require("@serguun42/pdf-parse");

const dataBuffer = fs.readFileSync("path/to/file.pdf");

PdfParse(dataBuffer)
	.then((data) => {
		// use data
	})
	.catch((error) => {
		// handle exceptions
	});
```

## Extend

-   v1.0.9 and above break pagerender callback [changelog](https://github.com/serguun42/pdf-parse/blob/master/CHANGELOG.md)
-   If you need another format like json, you can change page render behaviour with a callback
-   Check out https://mozilla.github.io/pdf.js/

```js
// default render callback
function render_page(pageData) {
	//check documents https://mozilla.github.io/pdf.js/
	let render_options = {
		//replaces all occurrences of whitespace with standard spaces (0x20). The default value is `false`.
		normalizeWhitespace: false,
		//do not attempt to combine same line TextItem's. The default value is `false`.
		disableCombineTextItems: false
	};

	return pageData.getTextContent(render_options).then((textContent) => {
		let lastY,
			text = "";
		for (let item of textContent.items) {
			if (lastY == item.transform[5] || !lastY) {
				text += item.str;
			} else {
				text += "\n" + item.str;
			}
			lastY = item.transform[5];
		}
		return text;
	});
}

let options = {
	pagerender: render_page
};

const dataBuffer = fs.readFileSync("path/to/file.pdf");

PdfParse(dataBuffer, options).then((data) => {
	// use new format
});
```

## Options

```js
const DEFAULT_OPTIONS = {
	// internal page parser callback
	// you can set this option, if you need another format except raw text
	pagerender: render_page,

	// max page number to parse
	max: 0,

	//check https://mozilla.github.io/pdf.js/getting_started/
	version: "v1.10.100"
};
```

### _pagerender_ (callback)

If you need another format except raw text.

### _max_ (number)

Max number of page to parse. If the value is less than or equal to 0, parser renders all pages.

### _version_ (string, pdf.js version)

check [pdf.js](https://mozilla.github.io/pdf.js/getting_started/)

-   `'default'`
-   `'v1.9.426'`
-   `'v1.10.100'`
-   `'v1.10.88'`
-   `'v2.0.550'`

> _default_ version is _v1.10.100_  
> [mozilla.github.io/pdf.js](https://mozilla.github.io/pdf.js/getting_started/#download)

## Tests

Removed

## License

[MIT licensed](https://gitlab.com/autokent/pdf-parse/blob/master/LICENSE) and all it's dependencies are MIT or BSD licensed.
This fork is also under MIT license.
