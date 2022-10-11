

<script lang="ts">
  
  import { fade, fly } from 'svelte/transition'
  import Page, { type PageDocument } from '$lib/components/Page.svelte'
  import Picture from '$lib/components/Picture.svelte'
  import Balados from '$lib/components/Balados.svelte'
  import ExplorerLinks from '$lib/components/ExplorerLinks.svelte'
  import ExplorerMore from '$lib/components/ExplorerMore.svelte'
  import Articles from '$lib/components/Articles.svelte'

  import type { PageData } from './$types'
  export let data: PageData
  const { page, balados } = data
	// export let page: PageDocument
  // export let balados: BaladoDocument[]
</script>

<Page {page} />

<ExplorerLinks current="balados" />

<section class="padded dark">
  <Articles articles={balados} />
</section>

<ExplorerMore />


<style lang="scss">
  section {
    color: var(--color);
  }
</style>