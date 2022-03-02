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
      query {
        page(id: "2kSFcw8y6f6cAVCN10AeY1") {
          titre
          id
          description
          couleur
        }
        expositionCollection {
          items {
            titre
            titreCourt
            id
            debut
          }
        }
      }
    `)
    if (data) {
      return {
        props: { 
          page: data.page,
          expositions: data.expositionCollection.items
        }
      }
    }
  }
</script>

<script lang="ts">
  import type { PageDocument } from '../[page].svelte'
  import Page from '$lib/components/Page.svelte'

	export let page: PageDocument
  export let expositions: ExpositionDocument[]
</script>

<Page {page} />

<section>
  <ol>
    {#each expositions as expo, i}
    <li>
      <a class="grid" href="/expositions/{expo.id}">
        <span>{new Date(expo.debut).getFullYear()}</span>
        <span>{expo.titreCourt}</span>
        <span>{expo.titre}</span>
        <span>Expositions</span>
      </a>
    </li>
    {/each}
  </ol>
</section>


<style lang="scss">
  section {
    color: var(--color);
  }
  
  ol {
    list-style: none;
    padding: var(--gutter);
    max-width: 910px;
    margin: 0 auto;
  }
</style>