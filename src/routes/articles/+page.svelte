<script lang="ts">
  
  import { fade, fly } from 'svelte/transition'
  import Page, { type PageDocument } from '$lib/components/Page.svelte'
  import Picture from '$lib/components/Picture.svelte'
  import Articles from '$lib/components/Articles.svelte'
  import ExplorerLinks from '$lib/components/ExplorerLinks.svelte'
  import ExplorerMore from '$lib/components/ExplorerMore.svelte'

  import type { PageData } from './$types'
  export let data: PageData
  // const { page, articles, p } = data
	// export let page: PageDocument
  // export let articles: ArticleDocument[]
  // export let p: number
</script>

<Page page={data.page} />

<ExplorerLinks current="articles" />

<section class="padded">
  <Articles articles={data.articles} p={data.p} />
</section>

<ExplorerMore />


<style lang="scss">
  section {
    color: var(--color);
  }
</style>