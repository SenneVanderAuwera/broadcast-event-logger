import { defineConfig, loadEnv } from 'vite';

import adapter from "@sveltejs/adapter-node";
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, ".", "");

	return {
		plugins: [
			tailwindcss(),
			sveltekit({
				// Consult https://svelte.dev/docs/kit/integrations
				// for more information about preprocessors
				preprocess: vitePreprocess(),

				// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
				// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
				// See https://svelte.dev/docs/kit/adapters for more information about adapters.
				adapter: adapter(),
				paths: {
					origin: env.ORIGIN
				},
				experimental: {
					remoteFunctions: true
				},
				compilerOptions: {
					experimental: {
						async: true
					}
				}
			})
		]
	};
});
