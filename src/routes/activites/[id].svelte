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
        activityCollection(limit: 1, where: {id: $id}) {
          items {
            __typename
            titre
            titreCourt
            id
            date
            intro {
              json
            }
            media ${media}
            personnesCollection {
              items {
                nom
                id
                position
              }
            }
            theme {
              titre
              titreCourt
              id
            }
            ${contenuCollection}
          }
        }
      }
    `, {
      pageId: "2iqQrSM1C0u4j1Tzhmoamx",
      id: params.id
    })
    if (data && data.activityCollection.items.length > 0) {
      return {
        props: { 
          page: data.page,
          activity: data.activityCollection.items[0]
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
  
  import type { ActivityDocument } from './index.svelte'
  import Picture from '$lib/components/Picture.svelte'
  import Contenu from '$lib/components/Contenu.svelte'
  import Comments from '$lib/components/Comments.svelte'
  import Article from '$lib/components/Article.svelte'

	export let page: PageDocument
  export let activity: ActivityDocument
</script>

<Page {page} noTitre />

<Article {page} article={activity} />


<style lang="scss">
</style>