import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    vue(),
    dts({
      skipDiagnostics: false,
      logDiagnostics: true,
      include: ['index.ts', 'src'],
      // copyDtsFiles: false,
    }),
    // {
    //   ...ts2({
    //     check: true,
    //     tsconfig: path.resolve(__dirname, 'tsconfig.json'),
    //     tsconfigOverride: {
    //       compilerOptions: {
    //         sourceMap: false,
    //         declaration: true,
    //         declarationMap: false,
    //       },
    //     },
    //   }),
    //   enforce: 'pre',
    // }
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    lib: {
      entry: 'index.ts',
      formats: ['es', 'umd'],
      name: 'common',
      fileName: 'index',
    },
    rollupOptions: {
      external: ['vue', '@anime-skip/ui'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
});
