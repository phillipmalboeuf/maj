<script context="module" lang="ts">
  import { query } from '$lib/clients/contentful'
  import { contenuCollection, media } from '$lib/nodes'

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
            media ${media}
            ${contenuCollection}
          }
        }
      }
    `, {
      id: params.page
    })
    if (data && data.pageCollection.items.length > 0) {
      return {
        props: { 
          page: data.pageCollection.items[0]
        }
      }
    }
  }
</script>

<script lang="ts">
  import Page, { type PageDocument } from '$lib/components/Page.svelte'
  import Picture from '$lib/components/Picture.svelte'

  export let page: PageDocument
</script>

<Page {page} />
{#if page.id === 'a-propos' && page.media}
<figure>
  <Picture media={page.media} />
</figure>
{/if}

<style lang="scss">
  figure {
    max-width: 42rem;
    margin: 0 auto;
  }
</style>