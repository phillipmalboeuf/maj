<script context="module" lang="ts">
  import { query } from '$lib/clients/contentful'
  import { contenuCollection, media } from '$lib/nodes'


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
            id
            titreCourt
            oeuvresCollection {
              items {
                ... on Oeuvre {
                  titre
                  id
                  media ${media}
                }
                ... on Soumission {
                  titre
                  id
                  bref
                  date
                  nom
                  media ${media}
                  description {
                    json
                  }
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
  import { onMount } from 'svelte'
  import { page as p } from '$app/stores'

  import Page, { type PageDocument } from '$lib/components/Page.svelte'
  import Oeuvres, { type OeuvreDocument } from '$lib/components/Oeuvres.svelte'
  import type { SoumissionDocument } from 'src/routes/forms/[form_id]/soumissions/[id].svelte'
  import Document from '$lib/components/document/Document.svelte'
  
  import type { ExpositionDocument } from './index.svelte'
  import ExpoLinks from '$lib/components/ExpoLinks.svelte'

	export let page: PageDocument
  export let exposition: ExpositionDocument
  export let oeuvres: SoumissionDocument[]
</script>

<Page {page} noTitre />

<article class="padded">
  <h1 class="center">{exposition.titreCourt}</h1>
  <center class="flex flex--center"><ExpoLinks type={$p.url.searchParams.get('type') || 'slider'} expo={exposition} /></center>
  {#key $p.url}
  <Oeuvres {exposition} oeuvres={oeuvres.filter(oeuvre => oeuvre.media)} type={$p.url.searchParams.get('type') || 'slider'} />
  {/key}
</article>


<style lang="scss">
  article {
    color: var(--color);
    overflow-x: hidden;
  }
</style>