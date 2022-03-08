<script context="module" lang="ts">
  import { query } from '$lib/clients/contentful'
  import { media } from '../[page].svelte'

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

	export let page: PageDocument
  export let expositions: ExpositionDocument[]

  let current: string | number
</script>

<Page {page} />

<section>
  <ol class="padded flex flex--nogap" on:pointerleave={() => current = undefined}>
    {#each [...expositions, ...expositions, ...expositions, ...expositions] as expo, i}
    <li class:current={current === i}>
      <a href="/expositions/{expo.id}" on:pointerenter={() => current = i}>
        {#if expo.media}<figure>
          <Picture media={expo.media} noDescription />
        </figure>{/if}
        <aside class="flex flex--spaced">
          <span>{expo.titreCourt}</span>
          <span>{DateTime.fromISO(expo.debut).toFormat('yyyy.ll.dd')}</span>
        </aside>
        <h4>{expo.titre}</h4>
      </a>
      <!-- {#if current === i}
      <aside class="flex flex--nogap">
      {#await query(fetch, `
        query($id: String!) {
          exposition(id: $id) {
            oeuvresCollection(limit: 7) {
              items {
                titre
                id
                media {
                  fileName
                  url
                  contentType
                  title
                  description
                  width
                  height
                }
              }
            }
          }
        }
      `, { id: expo.sys.id })}
      <figure />
      {:then { data }}
        {#each data.exposition.oeuvresCollection.items as oeuvre, i}
        <a href="/oeuvres/{oeuvre.id}">
          <figure>
            <Picture media={oeuvre.media} noDescription small />
          </figure>
        </a>
        {/each}
      {/await}
      </aside>
      {/if} -->
    </li>
    {/each}
  </ol>
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