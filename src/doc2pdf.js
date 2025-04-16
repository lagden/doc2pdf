import process from 'node:process'
import { tmpdir } from 'node:os'
import { randomUUID } from 'node:crypto'
import { join, sep } from 'node:path'
import { pathToFileURL, URL } from 'node:url'
import { mkdtemp, readFile, stat, unlink, writeFile } from 'node:fs/promises'
import { execFile } from 'node:child_process'
import Docxtemplater from 'docxtemplater'
import PizZip from 'pizzip'

/**
 * Get the LibreOffice executable path based on the operating system.
 * @returns {string[]} An array of possible LibreOffice executable paths.
 * @throws {Error} If the operating system is not supported.
 */
function getLibreOfficePath() {
	switch (process.platform) {
		case 'linux':
			return [
				'/usr/bin/soffice',
				'/usr/bin/libreoffice',
				'/usr/local/bin/soffice',
				'/usr/local/bin/libreoffice',
				'/snap/bin/libreoffice',
				'/opt/libreoffice/program/soffice',
			]
		case 'darwin':
			return ['/Applications/LibreOffice.app/Contents/MacOS/soffice']
		default:
			throw new Error('Unsupported operating system. Only Linux and macOS are supported.')
	}
}

/**
 * Find the LibreOffice executable in the given paths.
 * @param {string[]} execPaths - An array of possible executable paths.
 * @returns {Promise<string>} The path of the found LibreOffice executable.
 * @throws {Error} If LibreOffice is not found.
 */
async function findBin(execPaths) {
	let bin

	for (const path of execPaths ?? []) {
		try {
			const stats = await stat(path)
			if (stats.isFile()) {
				bin = path
				break
			}
		} catch {
			continue
		}
	}

	if (!bin) {
		throw new Error('LibreOffice not found. Make sure it is installed and in the PATH.')
	}

	return bin
}

/**
 * Convert a DOCX buffer to PDF.
 * @param {Buffer} docxBuffer - The DOCX file buffer.
 * @returns {Promise<Buffer>} A promise that resolves with the PDF file buffer.
 */
export function convert2pdf(docxBuffer) {
	return new Promise(async (resolve, reject) => {
		try {
			const execPaths = getLibreOfficePath()
			const bin = await findBin(execPaths)

			const rnd = randomUUID()
			const tempDir = pathToFileURL(tmpdir())
			const tempSofficeDir = await mkdtemp(join(tmpdir(), 'soffice-'))
			const sofficeDir = pathToFileURL(tempSofficeDir + sep)

			const pdfFile = new URL(`${rnd}.pdf`, sofficeDir)
			const docxFile = new URL(`${rnd}.docx`, sofficeDir)

			await writeFile(docxFile, docxBuffer)

			const args = [
				`-env:UserInstallation=${tempDir}`,
				'--headless',
				'--convert-to',
				'pdf',
				'--outdir',
				sofficeDir.pathname,
				docxFile.pathname,
			]

			execFile(bin, args, async (error, _stdout) => {
				// console.log(`execFile: ${bin} | stdout`, _stdout)

				if (error) {
					reject(error)
				} else {
					try {
						const content = await readFile(pdfFile)
						await Promise.all([unlink(docxFile), unlink(pdfFile)])
						resolve(content)
					} catch (error) {
						reject(error)
					}
				}
			})
		} catch (error) {
			reject(error)
		}
	})
}

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
export async function doc2pdf(args) {
	const {
		inputFile,
		outputFile,
		data,
		DXTOptions = {},
	} = args ?? {}

	// Read the input DOCX file and create a PizZip instance
	const content = await readFile(inputFile)
	const zip = new PizZip(content)

	// Create a new instance of Docxtemplater
	const doc = new Docxtemplater(zip, DXTOptions)

	// Replace placeholders with actual data
	doc.render(data)

	// Generate the updated DOCX buffer
	const docxBuffer = doc.getZip().generate({ type: 'nodebuffer', compression: 'DEFLATE' })

	// Convert DOCX buffer to PDF buffer
	const pdfBuffer = await convert2pdf(docxBuffer)

	// Write the PDF to file
	await writeFile(outputFile, pdfBuffer)

	return outputFile
}
