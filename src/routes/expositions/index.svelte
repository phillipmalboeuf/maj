<script context="module" lang="ts">
  import { query } from '$lib/clients/contentful'
  import { contenuCollection, media } from '$lib/nodes'
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
                  description {
                    json
                  }
                }
                ... on Soumission {
                  titre
                  id
                  date
                  nom
                  media ${media}
                  bref
                  description {
                    json
                  }
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
  import { onMount } from 'svelte'
  import { fade, fly } from 'svelte/transition'
  import Page, { type PageDocument } from '$lib/components/Page.svelte'
  import Picture from '$lib/components/Picture.svelte'
  import Oeuvres from '$lib/components/Oeuvres.svelte'
  import Overlay from '$lib/components/Overlay.svelte'
  import Document from '$lib/components/document/Document.svelte'
  import ExpoLinks from '$lib/components/ExpoLinks.svelte'
  import { date } from '$lib/formatters'
  import { titre } from '$lib/stores'
  import OeuvreOverlay from '$lib/components/OeuvreOverlay.svelte'

	export let page: PageDocument
  export let expositions: ExpositionDocument[]

  let elements: {[key: string]: HTMLElement} = {}
  let open: string

  onMount(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(node => {
          if (node.isIntersecting) {
            titre.set(node.target.getAttribute('data-titre'))
          }
        })
      },
      { threshold: 0, rootMargin: '-40% 0% -40%' }
    )

    Object.values(elements).forEach(element => observer.observe(element))

    return () => {
      observer.disconnect()
    }
  })
</script>

<Page {page} />

<section>
  {#each expositions as expo, i}
  <div class="flex flex--center padded" bind:this={elements[i]} id={expo.id}
    data-titre={expo.titreCourt || expo.titre}>
    <!-- <h3>{expo.titreCourt || expo.titre}</h3> -->
    <ExpoLinks {expo} type="folder" />
  </div>
  <ol class="padded flex flex--supertight">
    {#each expo.oeuvresCollection.items as oeuvre, j}
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
    <OeuvreOverlay bind:open={open} {oeuvre} />
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
</style>