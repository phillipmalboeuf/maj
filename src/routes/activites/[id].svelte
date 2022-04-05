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
        activityCollection(limit: 1, where: {id: $id}) {
          items {
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

	export let page: PageDocument
  export let activity: ActivityDocument


  // let readingTime: number
  // let element: HTMLElement
  // const wpm = 200

  // onMount(() => {
  //   // readingTime = Math.ceil(element.innerText.trim().split(/\s+/).length / wpm)
  // })
</script>

<Page {page} noTitre />

<article class="padded">
  <h2 class="center">{page.titre}</h2>

  <h1 class="d1 center">{activity.titre}</h1>

  <div class="flex flex--center">
    <span>{activity.date && DateTime.fromISO(activity.date).toFormat('yyyy.ll.dd')}</span>
    <span>{activity.personnesCollection.items.map(personne => [personne.nom, personne.position].join(', ')).join(', ')}</span>
    <!-- <span>{readingTime} min</span> -->
  </div>

  <figure class="padded">
    <!-- {#if activity.media}
    <Picture media={activity.media} />
    {/if} -->
  </figure>

  <aside><Document body={activity.intro} /></aside>
  <Contenu contenu={activity.contenuCollection.items}  />
</article>

<Comments />

{#if activity.theme}
<nav class="padded center" style="background-color: var(--{page.couleur?.toLowerCase()});">
  <button>Explorer davantage dans notre archive</button>
  {#await query(fetch, `
      query($themeId: String!) {
        activityCollection(limit: 9, where: {theme: { id: $themeId }}) {
          items {
            titre
            titreCourt
            id
            date
            media ${media}
          }
        }
      }
    `, {
      themeId: activity.theme.id
    })}
    ...
  {:then { data }}
  <div class="flex flex--center flex--nogap">
    {#each data.activityCollection.items as a}
    <a href="/activites/{a.id}">
      <figure>
        <Picture media={a.media} noDescription />
        <figcaption>{a.titreCourt || a.titre}</figcaption>
      </figure>
    </a>
    {/each}
  </div>
  {/await}
</nav>
{/if}


<style lang="scss">
  article {
    color: var(--color);
  }

  h1 {
    color: var(--dark);
    margin-bottom: 0;
  }

  nav {
    color: var(--light);

    > div {
      margin-top: 2rem;
    }

    a {
      text-align: left;
      max-width: 25%;

      figcaption {
        opacity: 0;
        transform: translateY(10px);
        transition: opacity 333ms, transform 333ms;
      }

      &:hover,
      &:focus {
        figcaption {
          opacity: 1;
          transform: translateY(0);
        }
      }
    }
  }
</style>