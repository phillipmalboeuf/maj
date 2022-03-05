<script context="module" lang="ts">
  import { query } from '$lib/clients/contentful'
  import { contenuCollection } from '../[page].svelte'

  export interface ArticleDocument {
    titre: string
    titreCourt?: string
    id: string
    date: string
    media?: object
    sys: {
      id: string
    }
    intro: {
      json: object
    }
    personnesCollection: {
      items: {
        nom: string
        id: string
        position: string
      }[]
    }
    contenuCollection: {
      items: any[]
    }
  }

  /** @type {import('@sveltejs/kit').Load} */
  export async function load({ fetch, params }) {
    const { data } = await query<{
      page: PageDocument
      articleCollection: {
        items: ArticleDocument[]
      }
    }>(fetch, `
      query {
        page(id: "2iqQrSM1C0u4j1Tzhmoamx") {
          titre
          id
          description
          couleur
          ${contenuCollection}
        }
        articleCollection(order: [date_DESC], limit: 10) {
          items {
            titre
            titreCourt
            id
            date
            media {
              fileName
              url
              contentType
              title
              description
              width
              height
            }
            personnesCollection(limit: 6) {
              items {
                nom
                id
                position
              }
            }
            ${contenuCollection}
          }
        }
      }
    `)
    if (data) {
      return {
        props: { 
          page: data.page,
          articles: data.articleCollection.items
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
  export let articles: ArticleDocument[]
</script>

<Page {page} />

<section class="padded">
  <ol class="grid grid--halves">
    {#each articles as article}
    <li>
      <a href="/articles/{article.id}">
        <figure>
          <Picture media={article.media} noDescription />
          <figcaption class="flex flex--spaced">
            <span>{article.personnesCollection.items.map(personne => [personne.nom].join(', ')).join(', ')}</span>
            <span>{article.date && DateTime.fromISO(article.date).toFormat('yyyy.ll.dd')}</span>
          </figcaption>
        </figure>
        <h3>{article.titreCourt || article.titre}</h3>
      </a>
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
    padding: 0;
  }
</style>