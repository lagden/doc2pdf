# doc2pdf

[![NPM version][npm-img]][npm] [![Build Status][ci-img]][ci] [![Coverage Status][coveralls-img]][coveralls]

[npm-img]: https://img.shields.io/npm/v/@tadashi/doc2pdf.svg
[npm]: https://www.npmjs.com/package/@tadashi/doc2pdf
[ci-img]: https://github.com/lagden/doc2pdf/actions/workflows/nodejs.yml/badge.svg
[ci]: https://github.com/lagden/doc2pdf/actions/workflows/nodejs.yml
[coveralls-img]: https://coveralls.io/repos/github/lagden/doc2pdf/badge.svg?branch=main
[coveralls]: https://coveralls.io/github/lagden/doc2pdf?branch=main

---

**doc2pdf** is a library that converts `docx` documents into `pdf`. It uses the `docxtemplater` library and allows for the creation of document templates that
can be generated with customized data. It depends on the `LibreOffice executable` being installed.

## Install

```
$ npm i @tadashi/doc2pdf
```

## Usage

```js
import { doc2pdf } from '@tadashi/doc2pdf'

const inputFile = new URL('./helper/doc1.docx', import.meta.url)
const outputFile = new URL('./helper/doc1.pdf', import.meta.url)
const data = {
	firstName: 'Lucas',
	lastName: 'Tadashi',
	age: 12,
}

const file = await doc2pdf({ inputFile, outputFile, data })
```

## Team

[<img src="https://avatars.githubusercontent.com/u/130963?s=390" alt="Lagden" width="90">](https://github.com/lagden)

---

> [!IMPORTANT]\
> Buy me a coffee!\
> BTC: `bc1q7famhuj5f25n6qvlm3sssnymk2qpxrfwpyq7g4`

## License

MIT © [Thiago Lagden](https://github.com/lagden)
