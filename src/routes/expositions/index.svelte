<script context="module" lang="ts">
  import { query } from '$lib/clients/contentful'


  export interface ExpositionDocument {
    titre: string
    titreCourt?: string
    id: string
    debut: Date
    fin: Date
    description?: string
    sys: {
      id: string
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

	export let page: PageDocument
  export let expositions: ExpositionDocument[]

  let current: string | number
</script>

<Page {page} />

<section>
  <ol class="padded" on:pointerleave={() => current = undefined}>
    {#each [...expositions, ...expositions, ...expositions, ...expositions] as expo, i}
    <li class:current={current === i}>
      <a class="flex" href="/expositions/{expo.id}" on:pointerenter={() => current = i}>
        <span>{new Date(expo.debut).getFullYear()}</span>
        <span>{expo.titreCourt}</span>
        <span>{expo.titre}</span>
        <span>Expositions</span>
      </a>
      {#if current === i}
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
      {/if}
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
      
      > a,
      > aside {
        max-width: 56.875rem;
        margin: 0 auto;
      }
      
      &.current {
        color: white;
        background: linear-gradient(180deg, #188507 23.44%, rgba(24, 133, 7, 0) 100%);
      }
    }
  }

  figure {
    width: 3rem;
    min-height: 6rem;
  }
</style>