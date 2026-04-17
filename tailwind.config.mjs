/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				// Surfaces — dark
				racing: '#002A1A',            // deepest anchor — footer, mobile nav overlay
				'racing-mid': '#003622',     // standard dark bg — hero, dark bands, quote bars
				forest: '#276D33',           // primary brand green — CTA sections, nav active, buttons on light

				// Accent
				gold: '#D4AF37',             // primary accent — labels on dark, rules, CTA fills on dark/forest
				'gold-hover': '#DFC04E',     // interactive state for gold elements

				// Surfaces — light
				cream: '#F0E9D0',            // warm secondary surface — cards, alternating sections
				white: '#FAFAF7',            // primary page background

				// Text
				ink: '#1A1A18',              // body text on light backgrounds
				'ink-soft': '#5b5b5b',       // secondary body text
				'ink-mute': '#878888',       // muted captions

				// Lines
				rule: '#bdc1cb',
			},
			fontFamily: {
				sans: ['"Geist Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
				display: ['"Martina Plantijn"', 'ui-serif', 'Georgia', 'serif'],
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
