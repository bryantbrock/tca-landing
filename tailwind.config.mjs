/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				// Surfaces
				canvas: '#ffffff',
				cream: '#fbf5e3',
				brand: '#003622',       // deep green — footer + display wordmark
				'brand-accent': '#276d33', // mid green — small caps eyebrows, emblem on light, list markers
				action: '#64ff5f',      // primary CTA pill (lime) — single source of truth, swap here
				pill: '#e0ddd2',        // secondary pill button background

				// Text
				ink: '#1e1e1e',         // headline text on light
				'ink-soft': '#5b5b5b',  // body text gray
				'ink-mute': '#878888',  // muted captions

				// Lines
				rule: '#bdc1cb',
			},
			fontFamily: {
				sans: ['"Geist Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
				display: ['"Cormorant Garamond"', 'ui-serif', 'Georgia', 'serif'],
				mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
			},
			fontSize: {
				// Display sizes used by the design that don't fit Tailwind's default scale.
				// 'wordmark' uses clamp() so it always fills the viewport without overflowing.
				'display-hero': ['200px', { lineHeight: '0.95', letterSpacing: '-0.02em' }],
				'display-section': ['80px', { lineHeight: '1.05', letterSpacing: '-0.01em' }],
				// Cap tuned so 'TRINITY' always fits within the 1344px canvas
				// content area (1440 max-w-canvas - 96px lg:px-12). At the cap,
				// 340px × 3.71em ≈ 1261px wide with ~80px safety buffer. The
				// clamp still scales linearly below the cap for narrower viewports.
				'wordmark': ['clamp(60px, 22vw, 340px)', { lineHeight: '0.85', letterSpacing: '-0.03em' }],
			},
			letterSpacing: {
				eyebrow: '0.12em',
			},
			borderRadius: {
				pill: '8px',
				card: '8px',
			},
			maxWidth: {
				canvas: '1440px',
			},
		},
	},
};
