<script lang="ts">
  
  import Page, { type PageDocument } from '$lib/components/Page.svelte'
  import { onMount } from 'svelte'
  
  import Article from '$lib/components/Article.svelte'
  import ParticiperSteps from '$lib/components/ParticiperSteps.svelte'
  import Questions from '$lib/components/Questions.svelte'

  import type { PageData } from './$types'
  export let data: PageData
  const { page, theme } = data
  // export let page: PageDocument
  // export let theme: ThemeDocument

  // page.titre = theme.titreCourt || theme.titre
</script>

<Page {page} noTitre />

<Article {page} article={theme} noBack noComments>
  <svelte:fragment slot="header"><ParticiperSteps current={1} /></svelte:fragment>
</Article>

<Questions />
<a href="/forms/participer" class="button fixed">Participer</a>


<style lang="scss">
  .button.fixed {
    position: sticky;
    bottom: var(--gutter);
    right: var(--gutter);
    float: right;
    color: var(--light);
    background-color: var(--rouge);
    border-color: transparent;
    z-index: 9;
    margin-top: var(--gutter);
  }
</style>