<script context="module" lang="ts">
  import { query } from '$lib/clients/contentful'
  import { contenuCollection, media } from '$lib/nodes'

  export interface ThemeDocument {
    __typename: string
    sys: {
      id: string
    }
    titre: string
    titreCourt?: string
    id: string
    date: string
    intro?: {
      json: object
    }
    personnesCollection: {
      items: {
        nom: string
        id: string
        position: string
      }[]
    }
  }

  import type { Load } from '@sveltejs/kit'
  export const load: Load = async ({ fetch, params }) => {
    const { data } = await query(fetch, `
      query($id: String!) {
        pageCollection(limit: 1, where: {id: $id}) {
          items {
            titre
            id
            description
            couleur
            ${contenuCollection}
          }
        }
        themeCollection(limit: 1, order: date_DESC) {
          items {
            __typename
            titre
            id
            titreCourt
            date
            intro {
              json
            }
            personnesCollection {
              items {
                id
                nom
              }
            }
          }
        }
      }
    `, {
      id: "participer"
    })
    if (data && data.pageCollection.items.length > 0) {
      return {
        props: {
          page: data.pageCollection.items[0],
          theme: data.themeCollection.items[0]
        }
      }
    }
  }
</script>

<script lang="ts">
  import Page, { type PageDocument } from '$lib/components/Page.svelte'
  import { onMount } from 'svelte'
  
  import Article from '$lib/components/Article.svelte'
  import ParticiperSteps from '$lib/components/ParticiperSteps.svelte'
  import Questions from '$lib/components/Questions.svelte'

  export let page: PageDocument
  export let theme: ThemeDocument

  page.titre = theme.titreCourt 
</script>

<Page {page} noTitre />

<Article {page} article={theme} noBack noComments>
  <svelte:fragment slot="header"><ParticiperSteps current={1} /></svelte:fragment>
</Article>

<Questions />
<a href="/forms/participer" class="button fixed">Participer</a>


<style lang="scss">
  .button.fixed {
    position: sticky;
    bottom: var(--gutter);
    right: var(--gutter);
    float: right;
    color: var(--light);
    background-color: var(--rouge);
    border-color: transparent;
    z-index: 9;
    margin-top: var(--gutter);
  }
</style>