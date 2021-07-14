import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
//import livereload from 'rollup-plugin-livereload';
//import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss';
// import monaco from 'rollup-plugin-monaco-editor';
// import ts from '@rollup/plugin-typescript';
// import typescript from 'typescript'
//import replace from 'rollup-plugin-replace';

const production = !process.env.ROLLUP_WATCH;

export default {
	input: 'src/svelte.js',   
  
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		dir: 'public',
		inlineDynamicImports : true
	},
	onwarn: function(warning) {
		// Skip certain warnings
	
		// should intercept ... but doesn't in some rollup versions
		if ( warning.code === 'THIS_IS_UNDEFINED' ) { return; }
	
		// console.warn everything else
		console.warn( warning.message );
	},
	plugins: [
		svelte({
			// enable run-time checks when not in production
			dev: !production,
			css: css => {
				css.write('bundle.css');
			},
			emitCss: true
		}),
		resolve({
			browser: true,
			dedupe: importee => importee === 'svelte' || importee.startsWith('svelte/'),
			preferBuiltins: false
		}),
		postcss({
			extract: true,
			minimize: true,
			use: [
			  ['sass', {
					includePaths: [
						'./node_modules'
					]
				}]
			]
		}),
		// monaco(),
		commonjs(),

        !production & serve(),
		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		// livereload({
		// 		watch: 'public',
		// }),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser()
	],
	watch: {
		clearScreen: false
	}
};

function serve() {
	let started = false;

	return {
		writeBundle() {
			if (!started) {
				started = true;

				require('child_process').spawn('npm', ['run', 'svelte-start', '--', '--dev'], {
					stdio: ['ignore', 'inherit', 'inherit'],
					shell: true
				});
			}
		}
	};
}