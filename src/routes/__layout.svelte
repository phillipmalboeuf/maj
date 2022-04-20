<script lang="ts">
  import '../app.scss'

  import Header from '$lib/components/Header.svelte'
  import Footer from '$lib/components/Footer.svelte'
  import Questions from '$lib/components/Questions.svelte'

  import { navigating, page } from '$app/stores'
</script>

<Header />

<main class:navigating={$navigating} id="top">
  <slot />
</main>

<Questions />
<Footer />

<style lang="scss">
  main:before {
		content: "";
		border-top: 2px solid var(--dark);
		position: fixed;
		top: 0;
		left: 0;
		width: 0%;
		box-sizing: border-box;
		transition: none;
		opacity: 0;
	}

	main.navigating:before {
		opacity: 1;
		width: 100%;
		transition: width 666ms, opacity 333ms;
	}
</style>