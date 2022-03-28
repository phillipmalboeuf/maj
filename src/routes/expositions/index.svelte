<script context="module" lang="ts">
  import { query } from '$lib/clients/contentful'
  import { media } from '../[page].svelte'
  import type { OeuvreDocument } from '$lib/components/Oeuvres.svelte'

  export interface ExpositionDocument {
    titre: string
    titreCourt?: string
    id: string
    debut: string
    fin: string
    description?: string
    sys: {
      id: string
    }
    media: object
    oeuvresCollection: {
      items: OeuvreDocument[]
    }
  }

  /** @type {import('@sveltejs/kit').Load} */
  export async function load({ fetch, params }) {
    const { data } = await query<{
      page: PageDocument
      expositionCollection: {
        items: ExpositionDocument[]
      }
    }>(fetch, `
      query {
        page(id: "2kSFcw8y6f6cAVCN10AeY1") {
          titre
          id
          description
          couleur
        }
        expositionCollection {
          items {
            sys {
              id
            }
            media ${media}
            titre
            titreCourt
            id
            debut
            oeuvresCollection(limit: 7) {
              items {
                titre
                id
                media ${media}
              }
            }
          }
        }
      }
    `)
    if (data) {
      return {
        props: { 
          page: data.page,
          expositions: data.expositionCollection.items
        }
      }
    }
  }
</script>

<script lang="ts">
  import { fade, fly } from 'svelte/transition'
  import Page, { type PageDocument } from '$lib/components/Page.svelte'
  import Picture from '$lib/components/Picture.svelte'
  import { DateTime } from 'luxon'
  import Oeuvres from '$lib/components/Oeuvres.svelte'

	export let page: PageDocument
  export let expositions: ExpositionDocument[]

  let current: string
</script>

<Page {page} />

<section>
  {#each [...expositions, ...expositions, ...expositions, ...expositions] as expo, i}
  <div class="flex flex--spaced padded">
    <h3>{expo.titreCourt || expo.titre}</h3>
    <span><a href="/expositions/{expo.id}" class="button">Voir toute l’exposition</a></span>
  </div>
  <ol class="padded flex flex--nogap" on:pointerleave={() => current = undefined}>
    {#each [...expo.oeuvresCollection.items,...expo.oeuvresCollection.items,...expo.oeuvresCollection.items] as oeuvre, j}
    <li class:current={current === `${i}.${j}`}>
      <a href="/expositions/{expo.id}/oeuvre/{oeuvre.id}" on:pointerenter={() => current = `${i}.${j}`}>
        <h5>{oeuvre.titre}</h5>
        <aside class="flex flex--spaced">
          <span>X</span>
          <span>{DateTime.fromISO(oeuvre.date).toFormat('yyyy.ll.dd')}</span>
        </aside>
        {#if oeuvre.media}<figure>
          <Picture media={oeuvre.media} noDescription />
        </figure>{/if}
      </a>
    </li>
    {/each}
  </ol>
  {/each}
</section>


<style lang="scss">
  section {
    color: var(--color);
  }
  
  ol {
    list-style: none;

    li {
      position: relative;
      flex: 1;

      transition: flex 420ms;

      &:hover {
        flex: 1.1;
      }
      
      // > a,
      // > aside {
      //   max-width: 56.875rem;
      //   margin: 0 auto;
      // }
      
      // &.current {
      //   color: white;
      //   background: linear-gradient(180deg, #188507 23.44%, rgba(24, 133, 7, 0) 100%);
      // }
    }
  }

  figure {
    // width: 3rem;
    // min-height: 6rem;
    margin-bottom: 0;
  }

  a {
    > aside,
    > h4 {
      padding: 0 0.5rem;
    }
  }
</style>