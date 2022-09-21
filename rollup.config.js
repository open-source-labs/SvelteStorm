import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss';
import autoPreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';

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
	onwarn: function(warning, warn) {
		if ( warning.code === 'THIS_IS_UNDEFINED' || warning.code === 'CIRCULAR_DEPENDENCY' || warning.code === 'PLUGIN_WARNING' ) { return; }
		warn(warning); 
	},
	plugins: [
		svelte({
			// enable run-time checks when not in production
			// dev: !production,
			// css: css => {
			// 	css.write('bundle.css');
			// },
			emitCss: true,
			preprocess: autoPreprocess()
		}),
		typescript({ sourceMap: !production }),
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
		
		commonjs(),

    !production & serve(),
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
