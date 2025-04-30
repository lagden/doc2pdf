import { URL } from 'node:url'
import { readFile, writeFile } from 'node:fs/promises'
import { convert } from 'libreoffice-convert'
import Docxtemplater from 'docxtemplater'
import PizZip from 'pizzip'

/**
 * Promisified version of the libreoffice-convert function.
 * @param {Buffer} input - The input file buffer.
 * @param {string} format - The desired output format (e.g., '.pdf').
 * @param {Object} [options] - Optional conversion options.
 * @returns {Promise<Buffer>} A promise that resolves with the converted file buffer.
 */
function convertAsync(input, format, options) {
	return new Promise((resolve, reject) => {
		convert(input, format, options, (error, result) => {
			if (error) {
				return reject(error)
			}
			resolve(result)
		})
	})
}

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
export async function doc2pdf(args) {
	const {
		inputFile,
		outputFile,
		onlyDocxBuffer = false,
		data,
		DXTOptions = {},
	} = args ?? {}

	// Validate inputFile
	if (typeof inputFile !== 'string' && inputFile instanceof URL === false) {
		throw new TypeError('inputFile must be a string or URL')
	}

	// Read the input DOCX file and create a PizZip instance
	const content = await readFile(inputFile)
	const zip = new PizZip(content)

	// Create a new instance of Docxtemplater
	const doc = new Docxtemplater(zip, DXTOptions)

	// Replace placeholders with actual data
	doc.render(data)

	// Generate the updated DOCX buffer
	const docxBuffer = doc.getZip().generate({ type: 'nodebuffer', compression: 'DEFLATE' })

	// If onlyDocxBuffer is true, return the DOCX buffer
	// This is useful for testing or if you want to save the DOCX file separately
	if (onlyDocxBuffer === true) {
		return docxBuffer
	}

	// Convert DOCX buffer to PDF buffer
	const pdfBuffer = await convertAsync(docxBuffer, '.pdf', undefined)

	// Write the PDF to file and return the output file path or URL
	if (typeof outputFile === 'string' || outputFile instanceof URL) {
		await writeFile(outputFile, pdfBuffer)
		return outputFile
	}

	// If no outputFile is specified, return the PDF buffer
	return pdfBuffer
}
