import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import react from '@vitejs/plugin-react';

const getCache = ({ name, pattern }: { name: string; pattern: string | RegExp }) => ({
	urlPattern: pattern,
	handler: 'NetworkFirst' as const,
	options: {
		cacheName: name,
		expiration: {
			maxEntries: 500,
			maxAgeSeconds: 60 * 60 * 24 * 365 * 2, // 2 years
		},
		cacheableResponse: {
			statuses: [200],
		},
	},
});

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		VitePWA({
			registerType: 'autoUpdate',
			manifest: {
				name: 'IT-Songbook',
				short_name: 'Songbook',
				description: 'The IT-Chapters Webapp Songbook 2.0',
				theme_color: '#403050',
				icons: [
					{
						src: 'icon-md.png',
						sizes: '192x192',
						type: 'image/png',
					},
					{
						src: 'icon-lg.png',
						sizes: '512x512',
						type: 'image/png',
					},
				],
			},
			workbox: {
				runtimeCaching: [
					getCache({
						name: 'songs.json',
						pattern:
							'https://raw.githubusercontent.com/itsektionen/songlist/master/dist/songs.json',
					}),
				],
				globPatterns: ['**/*.{js,css,html}', '*', 'assets/*', 'soundfonts/**/*.mp3'],
			},
		}),
	],
});
