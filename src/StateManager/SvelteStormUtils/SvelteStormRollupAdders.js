import banner from './rollup-plugin-pre-app-end'; 
    
export default {
  plugins: [
    banner({
      prependFile: path.join(__dirname, './SvelteStormUtils/SvelteStormdebugPrepend.js'),
      appendFile: path.join(__dirname, './SvelteStormUtils/SvelteStormdebugAppend.js'),
      encoding: 'utf-8', // default is utf-8
    }),
  ],
};