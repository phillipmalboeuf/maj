import node from '@sveltejs/adapter-node';
import auto from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		adapter: process.env.VERCEL ? auto() : node(),
		csrf: {
      checkOrigin: false,
    }
	}
};

export default config;
