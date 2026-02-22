declare module "pdf-parse" {
  interface PDFInfo {
    numpages: number;
    version: string;
  }

  interface PDFMetadata {
    _metadata?: Record<string, unknown>;
  }

  interface PDFText {
    text: string;
    info: PDFInfo;
    metadata: PDFMetadata;
  }

  type PDFSource = Buffer | Uint8Array;

  function pdf(source: PDFSource): Promise<PDFText>;

  export = pdf;
}

