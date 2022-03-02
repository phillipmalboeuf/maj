<script context="module" lang="ts">
  import { query } from '$lib/clients/contentful'


  export interface ExpositionDocument {
    titre: string
    titreCourt?: string
    id: string
    debut: Date
    fin: Date
    description?: string
  }

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
            id
            debut
            description {
              json
            }
          }
        }
      }
    `, {
      pageId: "2kSFcw8y6f6cAVCN10AeY1",
      id: "la-nature-morte"
    })
    if (data && data.expositionCollection.items.length > 0) {
      return {
        props: { 
          page: data.page,
          exposition: data.expositionCollection.items[0]
        }
      }
    }
  }
</script>

<script lang="ts">
  import type { PageDocument } from '../[page].svelte'
  import Page from '$lib/components/Page.svelte'

	export let page: PageDocument
  export let exposition: ExpositionDocument
</script>

<Page {page} noTitre />

<article>
  <h1 class="center">{exposition.titreCourt}</h1>
</article>


<style lang="scss">
  article {
    color: var(--color);
  }
</style>