<script context="module" lang="ts">
  import { query } from '$lib/clients/contentful'
  import { contenuCollection, media } from '$lib/nodes'

  export interface BaladoDocument {
    __typename: string
    titre: string
    titreCourt?: string
    id: string
    date: string
    audio: object
    media: object
    personnesCollection: {
      items: {
        nom: string
        id: string
        position: string
      }[]
    }
    sys: {
      id: string
    }
    intro: {
      json: object
    }
    introduction: {
      json: object
    }
    liens: object
  }

  /** @type {import('@sveltejs/kit').Load} */
  export async function load({ fetch, params }) {
    const { data } = await query<{
      page: PageDocument
      baladoCollection: {
        items: BaladoDocument[]
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
        baladoCollection(order: [date_DESC], limit: 10) {
          items {
            __typename
            titre
            titreCourt
            id
            date
            audio ${media}
            media ${media}
            liens
            intro {
              json
            }
            introduction {
              json
            }
          }
        }
      }
    `)
    if (data) {
      return {
        props: { 
          page: data.page,
          balados: data.baladoCollection.items
        }
      }
    }
  }
</script>

<script lang="ts">
  import { fade, fly } from 'svelte/transition'
  import Page, { type PageDocument } from '$lib/components/Page.svelte'
  import Picture from '$lib/components/Picture.svelte'
  import Balados from '$lib/components/Balados.svelte'
  import ExplorerLinks from '$lib/components/ExplorerLinks.svelte'
  import ExplorerMore from '$lib/components/ExplorerMore.svelte'
  import Articles from '$lib/components/Articles.svelte'

	export let page: PageDocument
  export let balados: BaladoDocument[]
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