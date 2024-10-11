import { appTools, defineConfig } from '@modern-js/app-tools';
import { tailwindcssPlugin } from '@modern-js/plugin-tailwindcss';
// https://modernjs.dev/en/configure/app/usage
export default defineConfig({
  runtime: {
    router: false,
  },
  html: {
    disableHtmlFolder: true,
  },
  source: {
    mainEntryName: 'index',
  },
  output: {
    distPath: {
      html: '/',
    },
  },
  // server:{
  //   baseUrl: '/'
  // },
  plugins: [
    appTools({
      bundler: 'rspack', // Set to 'webpack' to enable webpack
    }),
    tailwindcssPlugin(),
  ],
});
