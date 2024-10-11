import { defineConfig } from 'dumi';

export default defineConfig({
  title: '@alitojs/cb-builder',
  favicon: 'https://avatars.githubusercontent.com/u/49136103?s=200&v=4',
  logo: 'https://avatars.githubusercontent.com/u/49136103?s=200&v=4',
  outputPath: 'docs-dist',
  mode: 'site',
  navs: [
    null, // null 值代表保留约定式生成的导航，只做增量配置
    {
      title: 'GitHub',
      path: 'https://github.com/alitojs/cb-builder',
    },
  ],
});
