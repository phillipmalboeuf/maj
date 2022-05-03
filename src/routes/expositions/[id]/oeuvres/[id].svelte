<script context="module" lang="ts">
  import { query } from '$lib/clients/contentful'
  import { media } from '../../../[page].svelte'

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
        oeuvreCollection(limit: 1, where: {id: $id}) {
          items {
            titre
            id
            media ${media}
            description {
              json
            }
          }
        }
        soumissionCollection(limit: 1, where: {id: $id}) {
          items {
            titre
            id
            nom
            date
            ville
            media ${media}
            details
            description {
              json
            }
          }
        }
      }
    `, {
      pageId: "2kSFcw8y6f6cAVCN10AeY1",
      id: params.id
    })
    if (data && data.oeuvreCollection.items.length > 0) {
      return {
        props: { 
          page: data.page,
          oeuvre: data.oeuvreCollection.items[0]
        }
      }
    }
    if (data && data.soumissionCollection.items.length > 0) {
      return {
        props: { 
          page: data.page,
          oeuvre: data.soumissionCollection.items[0]
        }
      }
    }
  }
</script>

<script lang="ts">
  import { DateTime } from "luxon"
  import { onMount } from 'svelte'
  import type { OeuvreDocument } from '$lib/components/Oeuvres.svelte'
  import type { SoumissionDocument } from 'src/routes/forms/[form_id]/soumissions/[id].svelte'

  import Page, { type PageDocument } from '$lib/components/Page.svelte'
  import Document from '$lib/components/document/Document.svelte'
  import Comments from '$lib/components/Comments.svelte'
  import Picture from '$lib/components/Picture.svelte'

	export let page: PageDocument
  export let oeuvre: SoumissionDocument
</script>

<Page {page} />

<article class="padded">
  <h1 class="">{oeuvre.titre}</h1>

  <p>
    {#if oeuvre.nom}{oeuvre.nom}<br>{/if}
    {#if oeuvre.ville}{oeuvre.ville}<br>{/if}
    {#if oeuvre.date}{oeuvre.date}<br>{:else}Non datée<br>{/if}
  </p>
<!-- 
  <div class="grid">
    <span>{d?.toFormat('yyyy.mm.dd')} {f ? f.toFormat('yyyy.mm.dd') : ''}</span>
    <span>{curators.map(curator => [curator.nom, curator.position].join(', ')).join(', ')}</span>
    <span>{readingTime} min</span>
    <span><a href="/expositions/{exposition.id}/oeuvres">Oeuvres</a></span>
  </div> -->
  <div>
    <Document body={oeuvre.description} />
  </div>
  <figure>
    <Picture media={oeuvre.media} />
  </figure>
</article>

<Comments />


<style lang="scss">
  article {
    color: var(--color);

    > div {
      color: var(--dark);
    }
  }
</style>