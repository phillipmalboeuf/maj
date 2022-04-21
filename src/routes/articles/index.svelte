<script context="module" lang="ts">
  import { query } from '$lib/clients/contentful'
  import { contenuCollection, media } from '../[page].svelte'

  export interface ArticleDocument {
    __typename: string
    titre: string
    titreCourt?: string
    id: string
    date: string
    vedette?: boolean
    media?: object
    sys: {
      id: string
    }
    intro?: {
      json: object
    }
    personnesCollection: {
      items: {
        nom: string
        id: string
        position: string
      }[]
    }
    theme?: {
      titre: string
      titreCourt?: string
      id: string
    }
    contenuCollection?: {
      items: any[]
    }
  }

  /** @type {import('@sveltejs/kit').Load} */
  export async function load({ fetch, params }) {
    const { data } = await query<{
      page: PageDocument
      articleCollection: {
        items: ArticleDocument[]
      }
    }>(fetch, `
      query {
        page(id: "2iqQrSM1C0u4j1Tzhmoamx") {
          titre
          id
          description
          couleur
          ${contenuCollection}
        }
        articleCollection(order: [date_DESC], limit: 10) {
          items {
            titre
            titreCourt
            id
            date
            vedette
            media ${media}
            personnesCollection(limit: 6) {
              items {
                nom
                id
                position
              }
            }
            ${contenuCollection}
          }
        }
      }
    `)
    if (data) {
      return {
        props: { 
          page: data.page,
          articles: data.articleCollection.items
        }
      }
    }
  }
</script>

<script lang="ts">
  import { fade, fly } from 'svelte/transition'
  import Page, { type PageDocument } from '$lib/components/Page.svelte'
  import Picture from '$lib/components/Picture.svelte'
  import Articles from '$lib/components/Articles.svelte'
  import ExplorerLinks from '$lib/components/ExplorerLinks.svelte'
  import ExplorerMore from '$lib/components/ExplorerMore.svelte'

	export let page: PageDocument
  export let articles: ArticleDocument[]
</script>

<Page {page} />

<ExplorerLinks current="articles" />

<section class="padded">
  <Articles {articles} />
</section>

<ExplorerMore />


<style lang="scss">
  section {
    color: var(--color);
  }
</style>