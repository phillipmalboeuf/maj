<script context="module" lang="ts">
  import { query } from '$lib/clients/contentful'
  import { contenuCollection, media } from './[page].svelte'

  export interface ThemeDocument {
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
  import { DateTime } from 'luxon'
  import Document from '$lib/components/document/Document.svelte'

  export let page: PageDocument
  export let theme: ThemeDocument

  let readingTime: number
  let element: HTMLElement
  const wpm = 200

  onMount(() => {
    readingTime = Math.ceil(element.innerText.trim().split(/\s+/).length / wpm)
  })
</script>

<Page {page} noTitre />

<article bind:this={element} class="padded">
  <h2 class="h1 center">{theme.titreCourt}</h2>

  <div class="padded"></div>

  <h1 class="d1 center">{theme.titre}</h1>

  <div class="flex flex--center">
    <span>{theme.date && DateTime.fromISO(theme.date).toFormat('yyyy.ll.dd')}</span>
    <span>{theme.personnesCollection.items.map(personne => [personne.nom, personne.position].join(', ')).join(', ')}</span>
    <span>{readingTime} min</span>
  </div>

  <figure class="padded">
    <!-- {#if article.media}
    <Picture media={article.media} />
    {/if} -->
  </figure>

  <aside><Document body={theme.intro} /></aside>
</article>

<a href="/forms/participer" class="button fixed">Participer</a>


<style lang="scss">
  // nav {
  //   color: var(--color);
  // }
  
  article {
    color: var(--color);
  }

  h1 {
    color: var(--dark);
    margin-bottom: 0;
  }

  .button.fixed {
    position: fixed;
    bottom: var(--gutter);
    right: var(--gutter);
    color: var(--light);
    background-color: var(--rouge);
    border-color: transparent;
    z-index: 14;
    margin-top: var(--gutter);
  }
</style>