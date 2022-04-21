<script context="module" lang="ts">
  import { query } from '$lib/clients/contentful'
  import { contenuCollection, media } from './[page].svelte'

  /** @type {import('@sveltejs/kit').Load} */
  export async function load({ fetch, params }) {
    const { data } = await query(fetch, `
      query($id: String!) {
        pageCollection(limit: 1, where: {id: $id}) {
          items {
            titre
            id
            description
            couleur
            ${contenuCollection}
          }
        }
        articleCollection(limit: 6, order: date_DESC) {
          items {
            __typename
            titre
            id
            titreCourt
            date
            media ${media}
          }
        }
        baladoCollection(limit: 6, order: date_DESC) {
          items {
            __typename
            titre
            id
            titreCourt
            date
            media ${media}
          }
        }
        activityCollection(limit: 6, order: date_DESC) {
          items {
            __typename
            titre
            id
            titreCourt
            date
            media ${media}
          }
        }
      }
    `, {
      id: "explorer"
    })
    if (data && data.pageCollection.items.length > 0) {
      return {
        props: { 
          page: data.pageCollection.items[0],
          articles: data.articleCollection.items,
          balados: data.baladoCollection.items,
          activites: data.activityCollection.items
        }
      }
    }
  }
</script>

<script lang="ts">
  import Page, { type PageDocument } from '$lib/components/Page.svelte'
  import Articles from '$lib/components/Articles.svelte'
  import ExplorerLinks from '$lib/components/ExplorerLinks.svelte'

  import type { ArticleDocument } from './articles/index.svelte'
  import type { BaladoDocument } from './balados/index.svelte'
  import type { ActivityDocument } from './activites/index.svelte'

  export let page: PageDocument
  export let articles: ArticleDocument[]
  export let balados: BaladoDocument[]
  export let activites: ActivityDocument[]
</script>

<Page {page} />

<ExplorerLinks current="archives" />

<section class="padded">
  <Articles thirds archives articles={[...articles, ...balados, ...activites]} />
</section>

<style lang="scss">
  section {
    color: var(--color);
  }
</style>