import { PluginOption } from 'vite';

export default function AssetsRewrite(): PluginOption {
  return {
    name: 'assets-rewrite',
    enforce: 'post',
    apply: 'build',
    transformIndexHtml(html) {
      return html.replace(/"\/assets\//g, '"../assets/');
    },
  };
}
