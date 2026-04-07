/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				surface: '#0b0f14',
				foreground: '#e8edf2',
				muted: '#8b98a6',
			},
			fontFamily: {
				sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
				display: ['Cormorant Garamond', 'ui-serif', 'Georgia', 'serif'],
			},
		},
	},
};
