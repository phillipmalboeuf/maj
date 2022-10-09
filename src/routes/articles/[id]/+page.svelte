<script context="module" lang="ts">
  // throw new Error("@migration task: Check code was safely removed (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292722)");

  // import { query } from '$lib/clients/contentful'
  // import { contenuCollection, media } from '$lib/nodes'


  // /** @type {import('@sveltejs/kit').Load} */
  // export async function load({ fetch, params }) {
  //   const { data } = await query(fetch, `
  //     query($pageId: String!, $id: String!) {
  //       page(id: $pageId) {
  //         titre
  //         id
  //         description
  //         couleur
  //       }
  //       articleCollection(limit: 1, where: {id: $id}) {
  //         items {
  //           __typename
  //           titre
  //           titreCourt
  //           id
  //           vedette
  //           date
  //           intro {
  //             json
  //           }
  //           media ${media}
  //           hideMedia
  //           personnesCollection {
  //             items {
  //               nom
  //               id
  //               position
  //             }
  //           }
  //           theme {
  //             titre
  //             titreCourt
  //             id
  //           }
  //           ${contenuCollection}
  //         }
  //       }
  //     }
  //   `, {
  //     pageId: "2iqQrSM1C0u4j1Tzhmoamx",
  //     id: params.id
  //   })
  //   if (data && data.articleCollection.items.length > 0) {
  //     return {
  //       props: { 
  //         page: data.page,
  //         article: data.articleCollection.items[0]
  //       }
  //     }
  //   }
  // }
</script>

<script lang="ts">
  
  import { DateTime } from "luxon"
  import { onMount } from 'svelte'

  import Page, { type PageDocument } from '$lib/components/Page.svelte'
  import Document from '$lib/components/document/Document.svelte'
  
  // import type { ArticleDocument } from '../index.svelte'
  import Picture from '$lib/components/Picture.svelte'
  import Contenu from '$lib/components/Contenu.svelte'
  import Comments from '$lib/components/Comments.svelte'
  import Article from '$lib/components/Article.svelte'

  import type { PageData } from './$types'
  export let data: PageData
  const { page, article } = data
	// export let page: PageDocument
  // export let article: ArticleDocument
</script>

<Page {page} noTitre />

<Article {page} {article} />


<style lang="scss">
</style>