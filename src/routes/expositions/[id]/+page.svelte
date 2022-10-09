<script context="module" lang="ts">
  // throw new Error("@migration task: Check code was safely removed (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292722)");

  // import { query } from '$lib/clients/contentful'
  // import { contenuCollection, media } from '$lib/nodes'
  // interface OeuvreDocument {
  //   titre: string
  //   id: string
  //   description?: object
  //   media?: object
  //   date: string
  //   bref: string
  // }

  // export interface ExpositionDocument {
  //   titre: string
  //   titreCourt?: string
  //   id: string
  //   debut: string
  //   fin: string
  //   description?: string
  //   media?: object
  //   sys?: {
  //     id: string
  //   }
  //   oeuvresCollection?: {
  //     items: OeuvreDocument[]
  //   }
  //   curatorsCollection?: {
  //     items: CuratorDocument[]
  //   }
  // }

  // export interface CuratorDocument {
  //   nom: string
  //   id: string
  //   position?: string
  // }

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
  //       expositionCollection(limit: 1, where: {id: $id}) {
  //         items {
  //           titre
  //           titreCourt
  //           id
  //           debut
  //           description {
  //             json
  //           }
  //           oeuvresCollection {
  //             items {
  //               ... on Oeuvre {
  //                 titre
  //                 id
  //                 media ${media}
  //                 description {
  //                   json
  //                 }
  //               }
  //               ... on Soumission {
  //                 titre
  //                 id
  //                 media ${media}
  //                 bref
  //                 description {
  //                   json
  //                 }
  //               }
  //             }
  //           }
  //         }
  //       }
  //     }
  //   `, {
  //     pageId: "2kSFcw8y6f6cAVCN10AeY1",
  //     id: params.id
  //   })
  //   if (data && data.expositionCollection.items.length > 0) {
  //     return {
  //       props: { 
  //         page: data.page,
  //         exposition: data.expositionCollection.items[0],
  //         oeuvres: data.expositionCollection.items[0].oeuvresCollection.items,
  //       }
  //     }
  //   }
  // }
</script>

<script lang="ts">
  
  import { onMount } from 'svelte'
  import { fade, fly } from 'svelte/transition'
  import { goto } from '$app/navigation'

  import Page, { type PageDocument } from '$lib/components/Page.svelte'
  
  import ExpoOverlay from '$lib/components/ExpoOverlay.svelte'

  import type { PageData } from './$types'
  export let data: PageData
  const { page, exposition } = data
	// export let page: PageDocument
  // export let exposition: ExpositionDocument
</script>

<Page {page} noTitre />

<ExpoOverlay open {exposition} onClose={() => goto(`/expositions#${exposition.id}`)} />

<style lang="scss">
</style>