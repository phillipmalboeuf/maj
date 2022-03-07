<script context="module" lang="ts">
  import { query } from '$lib/clients/contentful'
  import { media } from '$routes/[page].svelte'


  /** @type {import('@sveltejs/kit').Load} */
  export async function load({ fetch, params }) {
    const { data } = await query(fetch, `
      query($pageId: String!, $id: String!) {
        page(id: $pageId) {
          titre
          id
          description
          couleur
        }
        expositionCollection(limit: 1, where: {id: $id}) {
          items {
            titre
            titreCourt
            oeuvresCollection {
              items {
                titre
                id
                media ${media}
                description {
                  json
                }
              }
            }
          }
        }
      }
    `, {
      pageId: "2kSFcw8y6f6cAVCN10AeY1",
      id: params.id
    })
    if (data && data.expositionCollection.items.length > 0) {
      return {
        props: { 
          page: data.page,
          exposition: data.expositionCollection.items[0],
          oeuvres: data.expositionCollection.items[0].oeuvresCollection.items
        }
      }
    }
  }
</script>

<script lang="ts">
  import Page, { type PageDocument } from '$lib/components/Page.svelte'
  import Oeuvres, { type OeuvreDocument } from '$lib/components/Oeuvres.svelte'
  import Document from '$lib/components/document/Document.svelte'
  import { onMount } from 'svelte'
  import type { ExpositionDocument } from '../[id].svelte'
  

	export let page: PageDocument
  export let exposition: ExpositionDocument
  export let oeuvres: OeuvreDocument[]

  let type = 'grid'
</script>

<Page {page} noTitre />

<article class="padded">
  <h1 class="center">{exposition.titreCourt}</h1>
  <button on:click={() => type = type === 'grid' ? 'slider' : 'grid'}>Disposition</button>
  <Oeuvres {oeuvres} {type} />
</article>


<style lang="scss">
  article {
    color: var(--color);
  }
</style>