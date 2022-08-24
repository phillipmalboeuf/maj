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
        expos: expositionCollection(order: [debut_DESC]) {
          items {
            sys {
              id
            }
            titre
            id
          }
        }
        expositionCollection(limit: 1, where: {id: $id}) {
          items {
            titre
            id
            titreCourt
            oeuvresCollection {
              items {
                ... on Oeuvre {
                  titre
                  id
                  media ${media}
                }
                ... on Soumission {
                  titre
                  id
                  bref
                  date
                  nom
                  media ${media}
                  description {
                    json
                  }
                }
              }
            }
          }
        }
      }
    `, {
      pageId: "2kSFcw8y6f6cAVCN10AeY1",
      id: params.id
    })
    if (data && data.expositionCollection.items.length > 0) {
      return {
        props: { 
          page: data.page,
          exposition: data.expositionCollection.items[0],
          expos: data.expos.items,
          oeuvres: data.expositionCollection.items[0].oeuvresCollection.items
        }
      }
    }
  }
</script>

<script lang="ts">
  import { onMount } from 'svelte'
  import { page as p } from '$app/stores'

  import Page, { type PageDocument } from '$lib/components/Page.svelte'
  import Oeuvres, { type OeuvreDocument } from '$lib/components/Oeuvres.svelte'
  import type { SoumissionDocument } from 'src/routes/forms/[form_id]/soumissions/[id].svelte'
  import Document from '$lib/components/document/Document.svelte'
  
  import type { ExpositionDocument } from './index.svelte'
  import ExpoLinks from '$lib/components/ExpoLinks.svelte'
  import { titre } from '$lib/stores'

	export let page: PageDocument
  export let expos: ExpositionDocument[]
  export let exposition: ExpositionDocument
  export let oeuvres: SoumissionDocument[]

  onMount(() => {
    titre.set(exposition.titreCourt || exposition.titre)
  })
  
</script>

<Page {page} noTitre />

{#key exposition.id}
{#if exposition}
{@const type = $p.url.searchParams.get('type') || 'slider'}
{@const index = expos.findIndex(expo => exposition.id === expo.id)}
{@const prev = index > 0 && expos[index - 1]}
{@const next = expos.length - 1 > index && expos[index + 1]}

<article class="padded">
  <h1 class="center h2">{exposition.titreCourt}</h1>
  <center class="flex flex--center"><ExpoLinks {type} expo={exposition} /></center>
  {#key $p.url}
  <Oeuvres {exposition} oeuvres={oeuvres.filter(oeuvre => oeuvre.media)} {type} />
  {/key}
</article>

<aside class="padded flex flex--spaced">
  
  {#if prev}
  <a href="/expositions/{prev.id}/oeuvres?type={type}" class="button">
    <svg width="53" height="32" style="transform: rotate(180deg);" viewBox="0 0 53 32" fill="none" xmlns="http://www.w3.org/2000/svg"> <line x1="15.623" y1="15.8079" x2="-0.000949809" y2="15.8079" stroke="currentColor" stroke-width="1.15"/> <path d="M38.023 31.616L52.9991 15.808L38.023 0H36.423L50.823 15.232H15.623V16.384H50.823L36.423 31.616H38.023Z" fill="currentColor"/> </svg>
    {prev.titre}
  </a>
  {:else}
  <span></span>
  {/if}
  {#if next}
  <a href="/expositions/{next.id}/oeuvres?type={type}" class="button">
    {next.titre}
    <svg width="53" height="32" viewBox="0 0 53 32" fill="none" xmlns="http://www.w3.org/2000/svg"> <line x1="15.623" y1="15.8079" x2="-0.000949809" y2="15.8079" stroke="currentColor" stroke-width="1.15"/> <path d="M38.023 31.616L52.9991 15.808L38.023 0H36.423L50.823 15.232H15.623V16.384H50.823L36.423 31.616H38.023Z" fill="currentColor"/> </svg>
  </a>
  {/if}
</aside>
{/if}
{/key}

<style lang="scss">
  article,
  aside {
    color: var(--color);
    overflow-x: hidden;
  }

  h1 {
    margin-bottom: var(--gutter);

    @media (max-width: 888px) {
      display: none;
    }
  }
</style>