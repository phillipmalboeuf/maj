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
    media?: object
    curatorsCollection?: {
      items: CuratorDocument[]
    }
  }

  export interface CuratorDocument {
    nom: string
    id: string
    position?: string
  }

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
        expositionCollection(limit: 1, where: {id: $id}) {
          items {
            titre
            titreCourt
            id
            debut
            description {
              json
            }
            curatorsCollection {
              items {
                nom
                id
                position
              }
            }
            oeuvresCollection {
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
          oeuvres: data.expositionCollection.items[0].oeuvresCollection.items,
          curators: data.expositionCollection.items[0].curatorsCollection.items
        }
      }
    }
  }
</script>

<script lang="ts">
  import { DateTime } from "luxon"
  import { onMount } from 'svelte'

  import Page, { type PageDocument } from '$lib/components/Page.svelte'
  import Oeuvres, { type OeuvreDocument } from '$lib/components/Oeuvres.svelte'
  import Document from '$lib/components/document/Document.svelte'
  import Comments from '$lib/components/Comments.svelte'
  import ExpoLinks from '$lib/components/ExpoLinks.svelte'

	export let page: PageDocument
  export let exposition: ExpositionDocument
  export let curators: CuratorDocument[]
  export let oeuvres: OeuvreDocument[]
  
  const d = exposition.debut && DateTime.fromISO(exposition.debut)
  const f = exposition.fin && DateTime.fromISO(exposition.fin)

  let readingTime: number
  let element: HTMLElement
  const wpm = 200

  onMount(() => {
    readingTime = Math.ceil(element.innerText.trim().split(/\s+/).length / wpm)
  })
</script>

<Page {page} noTitre />

<article bind:this={element} class="padded">
  <h2 class="center">{exposition.titreCourt}</h2>
  <br><br>

  <h1 class="d1 center">{exposition.titre}</h1>

  <div class="flex flex--middle flex--spaced padded">
    <span>{d?.toFormat('yyyy.ll.dd')} {f ? f.toFormat('yyyy.ll.dd') : ''}</span>
    <span>{curators.map(curator => [curator.nom, curator.position].join(', ')).join(', ')}</span>
    <span>{readingTime} min</span>
    <div><ExpoLinks expo={exposition} noDescription /></div>
  </div>

  <div class="description">
    <Document body={exposition.description} />
  </div>
  <Oeuvres {oeuvres} />
</article>

<Comments />


<style lang="scss">
  article {
    color: var(--color);

    .description {
      padding-top: 4rem;
      padding-bottom: 4rem;
    }
  }

  span {
    border: 1px solid;
    padding: 0.15em 0.5em;
    line-height: 1;
  }
</style>