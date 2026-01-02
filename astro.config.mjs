// @ts-check
import { defineConfig } from 'astro/config';
import rehypeMermaid from 'rehype-mermaid';

// https://astro.build/config
export default defineConfig({
	markdown: {
		// Avoid Shiki trying to highlight Mermaid code blocks; Mermaid renders these instead.
		syntaxHighlight: {
			type: 'shiki',
			excludeLangs: ['mermaid'],
		},
		rehypePlugins: [
			[
				rehypeMermaid,
				{
					// Inline SVG so we can adjust visuals with CSS for the site theme toggle (no client JS for Mermaid).
					strategy: 'inline-svg',
					mermaidConfig: {
						theme: 'base',
						themeVariables: {
							background: '#f9fafb',
							primaryColor: '#e2e8f0',
							primaryTextColor: '#0f172a',
							secondaryColor: '#cbd5e1',
							tertiaryColor: '#94a3b8',
							lineColor: '#334155',
							noteBkgColor: '#e2e8f0',
							noteTextColor: '#0f172a',
						},
					},
				},
			],
		],
	},
});
