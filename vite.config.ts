import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/

export default defineConfig(({ command, mode }) => {
    const env = loadEnv('', process.cwd(), '');
    return {
        plugins: [react()],
        define: {
            'process.env.REACT_APP_API_BASE_URL': JSON.stringify(env.API_BASE_URL),
            'process.env.YOUR_BOOLEAN_VARIABLE': env.YOUR_BOOLEAN_VARIABLE,
            // If you want to exposes all env variables, which is not recommended
            // 'process.env': env
        },
    };
});
// export default defineConfig({
//   plugins: [react()]
//   const env = loadEnv('', process.cwd());

// })
