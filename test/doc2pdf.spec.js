import assert from 'node:assert'
import { test } from 'node:test'
import { Buffer } from 'node:buffer'
import { stat } from 'node:fs/promises'
import { URL } from 'node:url'
import expressionParser from 'docxtemplater/expressions.js'
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

test('loop and conditions', async () => {
	const inputFile = new URL('./helper/doc3.docx', import.meta.url)
	const outputFile = new URL('./helper/doc3.pdf', import.meta.url)
	const data = {
		users: [
			{ name: 'Lucas', phone: '11 98888-8888', age: 12 },
			{ name: 'Lagden', phone: '11 98888-7777', age: 40 },
			{ name: 'Takamoto', phone: '11 98888-6666', age: 48 },
		],
		cars: ['Honda Civic', 'Toyota Corolla', 'Chevrolet Tracker'],
		'borrower.person.full_name': 'Lucas Tadashi',
		borrower: {
			person: {
				age: 12,
			},
		},
	}
	const DXTOptions = {
		parser: expressionParser,
		paragraphLoop: true,
		linebreaks: true,
	}

	const file = await doc2pdf({ inputFile, outputFile, data, DXTOptions })
	assert.equal(outputFile.pathname, file.pathname, 'Should be equal to outputFile')

	const fileStat = await stat(file)
	assert.ok(fileStat.isFile(), 'Should be a file')
	assert.equal(fileStat.size > 0, true, 'Should be greater than 0')
})

test('missing input file', async () => {
	await assert.rejects(
		async () => {
			await doc2pdf()
		},
		{
			name: 'TypeError',
			message: 'inputFile must be a string or URL',
		},
	)
})

test('buffer docx', async () => {
	const inputFile = new URL('./helper/doc1.docx', import.meta.url)
	const onlyDocxBuffer = true
	const data = {
		firstName: 'Lucas',
		lastName: 'Tadashi',
		age: 12,
	}

	const buffer = await doc2pdf({ inputFile, onlyDocxBuffer, data })
	assert.ok(buffer instanceof Buffer, 'Should be a buffer')
})

test('buffer pdf', async () => {
	const inputFile = new URL('./helper/doc1.docx', import.meta.url)
	const data = {
		firstName: 'Lucas',
		lastName: 'Tadashi',
		age: 12,
	}

	const buffer = await doc2pdf({ inputFile, data })
	assert.ok(buffer instanceof Buffer, 'Should be a buffer')
})
