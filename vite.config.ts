import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
	server: {
		port: 3003,
		open: true,
		host: true,
		proxy: {
			'/paylink/v1': {
				// target: 'http://192.168.20.218:8074',
				target: 'https://tenv-acquirer.rp-2023app.com',
				changeOrigin: true
				// rewrite: (path) => path.replace(/^\/api/, '')
			},
			'/openapi/v1': {
				target: 'http://192.168.20.218:8074',
				// target: 'https://tenv-acquirer.rp-2023app.com/',
				changeOrigin: true
				// rewrite: (path) => path.replace(/^\/api/, '')
			},
			'/.well-known/(.*)': {
				// deep link唤醒
				target: '/public/$1',
				rewrite: (path) => path.replace(/^\/public/, '')
			}
		}
	},
})

