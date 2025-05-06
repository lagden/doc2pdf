// import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
export default [
	{
		input: './src/doc2pdf.js',
		output: {
			dir: 'dist/doc2pdf.js',
			format: 'cjs',
			strict: false,
			sourcemap: false,
		},
		plugins: [
			// nodeResolve(),
			commonjs(),
		]
	},
]
