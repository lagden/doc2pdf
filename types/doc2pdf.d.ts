/**
 * @typedef {import('docxtemplater').DXT.Options} DXTOptions
 */
/**
 * Convert a DOCX file to PDF, with optional data replacement.
 * @param {Object} args - The arguments for the conversion.
 * @param {string|URL} args.inputFile - The path or URL to the input DOCX file.
 * @param {string|URL} [args.outputFile] - The path or URL for the output PDF file. If omitted, the function returns a PDF buffer.
 * @param {boolean} [args.onlyDocxBuffer=false] - If true, only the DOCX buffer is returned.
 * @param {Object} [args.data] - An object containing key-value pairs to replace placeholders in the DOCX file.
 * @param {DXTOptions} [args.DXTOptions={}] - Options for Docxtemplater.
 * @returns {Promise<Buffer|string|URL>} - Returns:
 *   - A Buffer containing the DOCX content if onlyDocxBuffer is true
 *   - A string or URL of the output file path if outputFile is provided
 *   - A Buffer containing the PDF content if no outputFile is specified
 * @throws {TypeError} If inputFile is not a string or URL.
 * @throws {Error} Any processing error.
 */
export function doc2pdf(args: {
    inputFile: string | URL;
    outputFile?: string | URL;
    onlyDocxBuffer?: boolean;
    data?: any;
    DXTOptions?: DXTOptions;
}): Promise<Buffer | string | URL>;
export type DXTOptions = import("docxtemplater").DXT.Options;
import { URL } from 'node:url';
