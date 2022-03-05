<script lang="ts">
  import '../app.scss'

  import Header from '$lib/components/Header.svelte'
  import Footer from '$lib/components/Footer.svelte'
  import Questions from '$lib/components/Questions.svelte'
</script>

<Header />

<main id="top">
  <slot />
</main>

<Questions />
<Footer />