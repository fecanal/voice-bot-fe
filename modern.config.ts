import { appTools, defineConfig } from '@modern-js/app-tools';

// https://modernjs.dev/en/configure/app/usage
export default defineConfig({
  runtime: {
    router: true,
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
  plugins: [
    appTools({
      bundler: 'rspack', // Set to 'webpack' to enable webpack
    }),
  ],
});
