import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
    base: './', // 相対パスで動作するように設定（GitHub Pages 対応）
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
