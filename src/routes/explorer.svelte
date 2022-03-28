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
            titre
            id
            titreCourt
            date
            media ${media}
            personnesCollection {
              items {
                id
                nom
              }
            }
          }
        }
        baladoCollection(limit: 6, order: date_DESC) {
          items {
            titre
            id
            titreCourt
            date
            audio ${media}
            liens
            introduction {
              json
            }
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
          balados: data.baladoCollection.items
        }
      }
    }
  }
</script>

<script lang="ts">
  import Page, { type PageDocument } from '$lib/components/Page.svelte'
  import Articles from '$lib/components/Articles.svelte'
  import Balados from '$lib/components/Balados.svelte'

  import type { ArticleDocument } from './articles/index.svelte'
  import type { BaladoDocument } from './balados/index.svelte'

  export let page: PageDocument
  export let articles: ArticleDocument[]
  export let balados: BaladoDocument[]
</script>

<Page {page} />
<section class="padded">
  <Articles {articles} />
</section>
<section class="padded dark">
  <Balados {balados} />
</section>

<style lang="scss">
  section {
    color: var(--color);

    &.dark {
      color: var(--light);
      background-color: var(--dark);
    }
  }
</style>