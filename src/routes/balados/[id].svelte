<script context="module" lang="ts">
  import { query } from '$lib/clients/contentful'
  import { contenuCollection, media } from '../[page].svelte'


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
        baladoCollection(limit: 1, where: {id: $id}) {
          items {
            __typename
            titre
            titreCourt
            id
            date
            audio ${media}
            media ${media}
            personnesCollection {
              items {
                nom
                id
                position
              }
            }
            liens
            intro {
              json
            }
            ${contenuCollection}
          }
        }
      }
    `, {
      pageId: "2iqQrSM1C0u4j1Tzhmoamx",
      id: params.id
    })
    if (data && data.baladoCollection.items.length > 0) {
      return {
        props: { 
          page: data.page,
          balado: data.baladoCollection.items[0]
        }
      }
    }
  }
</script>

<script lang="ts">
  import { DateTime } from "luxon"
  import { onMount } from 'svelte'

  import Page, { type PageDocument } from '$lib/components/Page.svelte'
  import Document from '$lib/components/document/Document.svelte'
  
  import type { BaladoDocument } from './index.svelte'
  import Picture from '$lib/components/Picture.svelte'
  import Article from '$lib/components/Article.svelte'
  import Audio from '$lib/components/Audio.svelte'

	export let page: PageDocument
  export let balado: BaladoDocument
</script>

<Page {page} noTitre />

<Article {page} article={balado}>
  <div class="padded" slot="extra">
    <figure class="grid">
      <span><Picture media={balado.media} /></span>
      <Audio controls media={balado.audio} />
    </figure>

    <nav class="flex flex--center flex--tight">
      {#each Object.entries(balado.liens) as [label, href]}
      <a {href} target="_blank" class="button">{label}</a><br>
      {/each}
    </nav>
  </div>
</Article>


<style lang="scss">
</style>