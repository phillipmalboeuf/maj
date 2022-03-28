<script context="module" lang="ts">
  import { query } from '$lib/clients/contentful'
  import { contenuCollection, media } from '../[page].svelte'

  export interface BaladoDocument {
    titre: string
    titreCourt?: string
    id: string
    date: string
    audio: object
    image: object
    sys: {
      id: string
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
            titre
            titreCourt
            id
            date
            media ${media}
            liens
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

	export let page: PageDocument
  export let balados: BaladoDocument[]
</script>

<Page {page} />

<section class="padded">
  <Balados {balados} />
</section>


<style lang="scss">
  section {
    color: var(--color);
  }
</style>