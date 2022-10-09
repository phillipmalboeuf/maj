<script context="module" lang="ts">
  // throw new Error("@migration task: Check code was safely removed (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292722)");

  // import { query } from '$lib/clients/contentful'
  // import { contenuCollection, media } from '$lib/nodes'
  // import type { ArticleDocument } from '../articles/index.svelte'

  // export interface ActivityDocument {
  //   __typename: string
  //   titre: string
  //   titreCourt?: string
  //   id: string
  //   date: string
  //   media?: object
  //   sys: {
  //     id: string
  //   }
  //   intro: {
  //     json: object
  //   }
  //   personnesCollection: {
  //     items: {
  //       nom: string
  //       id: string
  //       position: string
  //     }[]
  //   }
  //   theme: {
  //     titre: string
  //     titreCourt?: string
  //     id: string
  //   }
  //   contenuCollection: {
  //     items: any[]
  //   }
  // }
  // 
  // /** @type {import('@sveltejs/kit').Load} */
  // export async function load({ fetch, params }) {
  //   const { data } = await query<{
  //     page: PageDocument
  //     activityCollection: {
  //       items: ActivityDocument[]
  //     },
  //     articleCollection: {
  //       items: ArticleDocument[]
  //     }
  //   }>(fetch, `
  //     query {
  //       page(id: "2iqQrSM1C0u4j1Tzhmoamx") {
  //         titre
  //         id
  //         description
  //         couleur
  //         ${contenuCollection}
  //       }
  //       articleCollection(order: [date_DESC], limit: 10, where: { type: "Activité" }) {
  //         items {
  //           __typename
  //           titre
  //           titreCourt
  //           id
  //           date
  //           media ${media}
  //           personnesCollection(limit: 6) {
  //             items {
  //               nom
  //               id
  //               position
  //             }
  //           }
  //           ${contenuCollection}
  //         }
  //       }
  //       activityCollection(order: [date_DESC], limit: 10) {
  //         items {
  //           __typename
  //           titre
  //           titreCourt
  //           id
  //           date
  //           media ${media}
  //           personnesCollection(limit: 6) {
  //             items {
  //               nom
  //               id
  //               position
  //             }
  //           }
  //           ${contenuCollection}
  //         }
  //       }
  //     }
  //   `)
  //   if (data) {
  //     return {
  //       props: { 
  //         page: data.page,
  //         activites: [...data.activityCollection.items, ...data.articleCollection.items].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  //       }
  //     }
  //   }
  // }
</script>

<script lang="ts">
  
  import { fade, fly } from 'svelte/transition'
  import Page, { type PageDocument } from '$lib/components/Page.svelte'
  import Picture from '$lib/components/Picture.svelte'
  import Articles from '$lib/components/Articles.svelte'
  import ExplorerLinks from '$lib/components/ExplorerLinks.svelte'
  import ExplorerMore from '$lib/components/ExplorerMore.svelte'

  import type { PageData } from './$types'
  export let data: PageData
  const { page, activites } = data
	// export let page: PageDocument
  // export let activites: ActivityDocument[]
</script>

<Page {page} />

<ExplorerLinks current="activites" />

<section class="padded">
  <Articles articles={activites} />
</section>

<ExplorerMore />


<style lang="scss">
  section {
    color: var(--color);
  }
</style>