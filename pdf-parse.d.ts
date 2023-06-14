// Type definitions for @serguun42/pdf-parse@2.0
// Project fork: https://github.com/serguun42/pdf-parse
// Project origin: https://gitlab.com/autokent/pdf-parse
// Definitions by: Philipp Katz <https://github.com/qqilihq>
// Definitions modified by: serguun42 <https://github.com/serguun42>
// Definitions From: https://github.com/DefinitelyTyped/DefinitelyTyped

export = PdfParse;

declare function PdfParse(dataBuffer: Buffer, options?: PdfParse.Options): Promise<PdfParse.Result>;

declare namespace PdfParse {
  type Version = 'default' | 'v1.9.426' | 'v1.10.100' | 'v1.10.88' | 'v2.0.550';
  type PageRenderer = (pageData: any) => string | PromiseLike<string>;
  interface Result {
    /** number of pages */
    numpages: number;
    /** number of rendered pages */
    numrender: number;
    /** PDF info */
    info: any;
    /** PDF metadata */
    metadata: any;
    /** PDF.js version */
    version: Version;
    /** PDF text */
    text: string;
  }
  interface Options {
    /**
     * Internal page parser callback.
     * You can set this option, if you need another format except raw text
     */
    pagerender?: PageRenderer;
    /**
     * Max number of page to parse.
     * If the value is less than or equal to 0, parser renders all pages.
     */
    max?: number;
  }
}
