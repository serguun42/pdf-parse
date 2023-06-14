const PDFJS = require('pdfjs-dist/legacy/build/pdf.js');

/** @type {import('./pdf-parse.d.ts').PageRenderer} */
function DefaultPageRenderer(pageData) {
  // check documents https://mozilla.github.io/pdf.js/
  // ret.text = ret.text ? ret.text : "";

  const renderOptions = {
    // replaces all occurrences of whitespace with standard spaces (0x20). The default value is `false`.
    normalizeWhitespace: false,
    // do not attempt to combine same line TextItem's. The default value is `false`.
    disableCombineTextItems: false,
  };

  return pageData.getTextContent(renderOptions).then((textContent) => {
    let lastY;
    let text = '';
    // https://github.com/mozilla/pdf.js/issues/8963
    // https://github.com/mozilla/pdf.js/issues/2140
    // https://gist.github.com/hubgit/600ec0c224481e910d2a0f883a7b98e3
    // https://gist.github.com/hubgit/600ec0c224481e910d2a0f883a7b98e3

    // eslint-disable-next-line no-restricted-syntax
    for (const item of textContent.items) {
      if (lastY === item.transform[5] || !lastY) text += item.str;
      else text += `\n${item.str}`;

      // eslint-disable-next-line prefer-destructuring
      lastY = item.transform[5];
    }

    // let strings = textContent.items.map(item => item.str);
    // let text = strings.join("\n");
    // text = text.replace(/[ ]+/ig," ");
    // ret.text = `${ret.text} ${text} \n\n`;
    return text;
  });
}

/** @type {import('./pdf-parse.d.ts').Options} */
const DEFAULT_OPTIONS = {
  pagerender: DefaultPageRenderer,
  max: 0,
};

/** @type {import('./pdf-parse.d.ts')} */
async function PdfParse(dataBuffer, options) {
  /** @type {import('./pdf-parse.d.ts').Result} */
  const ret = {
    numpages: 0,
    numrender: 0,
    info: null,
    metadata: null,
    text: '',
    version: null,
  };

  if (typeof options === 'undefined') options = DEFAULT_OPTIONS;
  if (typeof options.pagerender !== 'function') options.pagerender = DEFAULT_OPTIONS.pagerender;
  if (typeof options.max !== 'number') options.max = DEFAULT_OPTIONS.max;

  ret.version = PDFJS.version;

  // Disable workers to avoid yet another cross-origin issue (workers need
  // the URL of the script to be loaded, and dynamically loading a cross-origin
  // script does not work).
  PDFJS.disableWorker = true;
  const uint8Arr = new Uint8Array(dataBuffer);
  const docLoading = PDFJS.getDocument(uint8Arr);
  const doc = await docLoading.promise;
  ret.numpages = doc.numPages;

  const metaData = await doc.getMetadata().catch(() => Promise.resolve(null));

  ret.info = metaData ? metaData.info : null;
  ret.metadata = metaData ? metaData.metadata : null;

  let counter = options.max <= 0 ? doc.numPages : options.max;
  counter = counter > doc.numPages ? doc.numPages : counter;

  ret.text = '';

  for (let i = 1; i <= counter; i++) {
    // eslint-disable-next-line no-await-in-loop
    const pageText = await doc
      .getPage(i)
      .then((pageData) => options.pagerender(pageData))
      .catch(() => Promise.resolve(''));

    ret.text = `${ret.text}\n\n${pageText}`;
  }

  ret.numrender = counter;
  doc.destroy();

  return ret;
}

module.exports = PdfParse;
