/**
 * Convert a DOCX buffer to PDF.
 * @param {Buffer} docxBuffer - The DOCX file buffer.
 * @returns {Promise<Buffer>} A promise that resolves with the PDF file buffer.
 */
export function convert2pdf(docxBuffer: Buffer): Promise<Buffer>;
/**
 * @typedef {import('docxtemplater').DXT.Options} DXT.Options
 */
/**
 * Convert a DOCX file to PDF, with optional data replacement.
 * @param {Object} args - The arguments for the conversion.
 * @param {string|URL} args.inputFile - The path or URL to the input DOCX file.
 * @param {string|URL} args.outputFile - The path or URL for the output PDF file.
 * @param {Object} [args.data] - The data to replace placeholders in the DOCX file.
 * @param {DXT.Options} [args.DXTOptions={}] - Options for Docxtemplater.
 * @returns {Promise<string|URL>} A promise that resolves with the path or URL of the output PDF file.
 */
export function doc2pdf(args: {
    inputFile: string | URL;
    outputFile: string | URL;
    data?: any;
    DXTOptions?: Docxtemplater.DXT.Options;
}): Promise<string | URL>;
export namespace DXT {
    type Options = import("docxtemplater").DXT.Options;
}
import { URL } from 'node:url';
import Docxtemplater from 'docxtemplater';
