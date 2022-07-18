import BannerPlugin from './rollup-plugin-pre-app-end-meat';

export default function banner(options = {}) {
  const plugin = new BannerPlugin(options);
  return {
    name: 'banner',
    renderChunk(code) {
      return plugin.appendBanner(plugin.prependBanner(code));
    },
  };
}
