import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    base: "/loubottin",
    build: {
        outDir: "docs"
    }
})
