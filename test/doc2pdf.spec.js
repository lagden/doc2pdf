import assert from 'node:assert'
import { test } from 'node:test'
import { stat } from 'node:fs/promises'
import { URL } from 'node:url'
import { doc2pdf } from '../src/doc2pdf.js'

test('basic', async () => {
	const inputFile = new URL('./helper/doc1.docx', import.meta.url)
	const outputFile = new URL('./helper/doc1.pdf', import.meta.url)
	const data = {
		firstName: 'Lucas',
		lastName: 'Tadashi',
		age: 12,
	}

	const file = await doc2pdf({ inputFile, outputFile, data })
	assert.equal(outputFile.pathname, file.pathname, 'Should be equal to outputFile')

	const fileStat = await stat(file)
	assert.ok(fileStat.isFile(), 'Should be a file')
	assert.equal(fileStat.size > 0, true, 'Should be greater than 0')
})

test('customize: delimiters and loop', async () => {
	const inputFile = new URL('./helper/doc2.docx', import.meta.url)
	const outputFile = new URL('./helper/doc2.pdf', import.meta.url)
	const data = {
		'borrower.person.full_name': 'Lucas Tadashi',
		cars: [{ name: 'Honda Civic' }, { name: 'Toyota Corolla' }],
	}

	const DXTOptions = {
		delimiters: { start: '{{', end: '}}' },
		modules: [
			{
				optionsTransformer(options, doc) {
					for (const module of doc.modules) {
						if (module.name === 'LoopModule') {
							module.prefix.start = 'FOR '
							module.prefix.end = /^ENDFOR ?(.*)/
						}
					}
					return options
				},
			},
		],
		paragraphLoop: true,
		linebreaks: true,
	}

	const file = await doc2pdf({
		inputFile,
		outputFile,
		data,
		DXTOptions,
	})

	assert.equal(outputFile.pathname, file.pathname, 'Should be equal to outputFile')

	const fileStat = await stat(file)
	assert.ok(fileStat.isFile(), 'Should be a file')
	assert.equal(fileStat.size > 0, true, 'Should be greater than 0')
})
