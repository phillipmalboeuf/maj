<script context="module" lang="ts">
  import { query } from '$lib/clients/contentful'
  import { media } from '../[page].svelte'
  import type { OeuvreDocument } from '$lib/components/Oeuvres.svelte'
  import type { SoumissionDocument } from '../forms/[form_id]/soumissions/[id].svelte'

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
      items: SoumissionDocument[]
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
                ... on Oeuvre {
                  titre
                  id
                  media ${media}
                }
                ... on Soumission {
                  titre
                  id
                  date
                  nom
                  media ${media}
                }
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
  import Oeuvres from '$lib/components/Oeuvres.svelte'
  import Overlay from '$lib/components/Overlay.svelte'
  import Document from '$lib/components/document/Document.svelte'
  import ExpoLinks from '$lib/components/ExpoLinks.svelte'
  import { date } from '$lib/formatters'

	export let page: PageDocument
  export let expositions: ExpositionDocument[]

  let open: string
</script>

<Page {page} />

<section>
  {#each [...expositions, ...expositions, ...expositions, ...expositions] as expo, i}
  <div class="flex flex--center padded" id={expo.id}>
    <!-- <h3>{expo.titreCourt || expo.titre}</h3> -->
    <ExpoLinks {expo} type="folder" />
  </div>
  <ol class="padded flex flex--supertight">
    {#each [...expo.oeuvresCollection.items,...expo.oeuvresCollection.items,...expo.oeuvresCollection.items] as oeuvre, j}
    <li>
      <a href="/expositions/{expo.id}/oeuvres/{oeuvre.id}"
        on:click|preventDefault={() => open = `${i}.${j}`}>
        <h5>{oeuvre.titre}</h5>
        <aside class="flex flex--spaced">
          <span>{oeuvre.nom}</span>
          <span>{date(oeuvre.date)}</span>
        </aside>
        {#if oeuvre.media}<figure>
          <Picture media={oeuvre.media} noDescription />
        </figure>{/if}
      </a>
    </li>

    {#if open === `${i}.${j}`}
    <Overlay bind:open={open}>
      <article class="padded" transition:fly={{ y: 100 }}>
        <button transition:fade on:click={() => open = undefined} area-label="Close">Close</button>

        <h1 class="">{oeuvre.titre}</h1>

        <p>
          {#if oeuvre.nom}{oeuvre.nom}<br>{/if}
          {#if oeuvre.ville}{oeuvre.ville}<br>{/if}
          {#if oeuvre.date}{oeuvre.date}<br>{:else}Non datée<br>{/if}
        </p>
        <div>
          <Document body={oeuvre.description} />
        </div>
        <figure>
          <Picture media={oeuvre.media} />
        </figure>
      </article>
    </Overlay>
    {/if}
    {/each}
  </ol>
  {/each}
</section>




<style lang="scss">
  section {
    color: var(--color);

    @media (max-width: 888px) {
      > div {
        flex-direction: column;
      }
    }
  }
  
  ol {
    list-style: none;

    li {
      position: relative;
      flex: 1;

      transition: flex 420ms;

      // &:hover {
      //   flex: 1.1;
      // }
      
      // > a,
      // > aside {
      //   max-width: 56.875rem;
      //   margin: 0 auto;
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
    > h5 {
      padding: 0 0.5rem;
    }

    > h5 {
      margin-bottom: 0;
    }

    > aside {
      margin-bottom: 0.5rem;
    }
  }

  article {
    position: relative;
    max-width: 911px;
    margin: var(--gutter) auto;
    background-color: var(--light);
    border-radius: 1.5rem;
    padding: calc(var(--gutter) / 2);

    > button {
      position: absolute;
      top: calc(var(--gutter) / 2);
      right: calc(var(--gutter) / 2);
    }
  }
</style>