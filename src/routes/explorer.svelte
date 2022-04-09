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
        articleCollection(limit: 3, order: date_DESC) {
          items {
            __typename
            titre
            id
            titreCourt
            vedette
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
            __typename
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
        activityCollection(limit: 3, order: date_DESC) {
          items {
            __typename
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
  import Balados from '$lib/components/Balados.svelte'

  import type { ArticleDocument } from './articles/index.svelte'
  import type { BaladoDocument } from './balados/index.svelte'
  import type { ActivityDocument } from './activites/index.svelte'

  export let page: PageDocument
  export let articles: ArticleDocument[]
  export let balados: BaladoDocument[]
  export let activites: ActivityDocument[]
</script>

<Page {page} />

<nav class="padded flex flex--tight flex--center flex--middle">
  <a href="/articles" class="button">Articles</a>
  <a href="/balados" class="button">Balados</a>
  <a href="/activites" class="button">Activités</a>
  <a href="/archives">Archives</a>
</nav>

<section class="padded">
  <Articles thirds {articles} />
</section>
<section class="padded dark">
  <Balados {balados} />
</section>
<section class="padded">
  <Articles thirds articles={activites} />
</section>

<style lang="scss">
  nav {
    color: var(--color);
  }
  
  section {
    color: var(--color);

    &.dark {
      color: var(--light);
      background-color: var(--dark);
    }
  }
</style>