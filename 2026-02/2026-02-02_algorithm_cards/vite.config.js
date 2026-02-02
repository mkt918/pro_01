import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
    base: '/pro_01/', // リポジトリ名をベースパスに設定（GitHub Pages 対応）
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        rollupOptions: {
            output: {
                manualChunks: undefined,
            },
        },
    },
})
