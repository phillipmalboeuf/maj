<script lang="ts">
  import { DateTime } from "luxon"
  import { onMount } from 'svelte'
  
  import { query } from '$lib/clients/contentful'

  import type { PageDocument } from '$lib/components/Page.svelte'
  import type { ArticleDocument } from '../../routes/articles/index.svelte'
  import Document from '$lib/components/document/Document.svelte'
  
  import Picture from '$lib/components/Picture.svelte'
  import Contenu from '$lib/components/Contenu.svelte'
  import Comments from '$lib/components/Comments.svelte'
  import { contenuCollection, media } from '$lib/nodes'
  import Articles from './Articles.svelte'
  import { date } from '$lib/formatters'


	export let page: PageDocument
  export let article: ArticleDocument

  export let noBack = false
  export let noComments = false

  let type = article.__typename.toLowerCase()


  let readingTime: number
  let element: HTMLElement
  const wpm = 200

  onMount(() => {
    readingTime = Math.ceil(element.innerText.trim().split(/\s+/).length / wpm)
  })
</script>


{#key article.id}
<article bind:this={element} class="padded">
  <h2 class="center">{page.titre}</h2>
  
  <br>

  <slot name="header" />

  {#if !noBack}
  <center>
    <a href="/{{ 'activity': 'activite' }[type] || type}s" on:click={() => {
      history.back()
    }} class="button button--tight">← Retour</a>
  </center>

  <br><br><br>
  {/if}

  <h1 class="d1 center">{article.titre}</h1>
  
  <br>

  <div class="flex flex--center info">
    <span>{date(article.date)}</span>
    {#if article.personnesCollection?.items?.length}<span>{article.personnesCollection.items.map(personne => [personne.nom, personne.position].filter(e => e).join(', ')).join(', ')}</span>{/if}
    <span>{readingTime} min</span>
  </div>

  <div class="padded"><br><br></div>

  {#if article.media && article.afficherMedia}
  <figure>
    <Picture media={article.media} maxHeight />
  </figure>
  {/if}

  <aside class="h5"><Document body={article.intro} /></aside>
  {#if article.contenuCollection}<Contenu contenu={article.contenuCollection.items} />{/if}

  <slot name="extra" />
</article>

{#if article.theme}
<nav class="padded">
  <center><h4>Contenus connexes</h4></center>
  {#await query(fetch, `
      query($themeId: String!) {
        themeCollection(limit: 1, where: { id: $themeId }) {
          items {
            titre
            linkedFrom {
              entryCollection(limit: 3) {
                items {
                  __typename
                  ... on Article {
                    titre
                    titreCourt
                    date
                    id
                    media ${media}
                  }
                  ... on Balado {
                    titre
                    titreCourt
                    date
                    id
                    media ${media}
                  }
                  ... on Activity {
                    titre
                    titreCourt
                    date
                    id
                    media ${media}
                  }
                }
              }
            }
          }
        }
      }
    `, {
      themeId: article.theme.id
    })}
    ...
  {:then { data }}
  <Articles thirds archives articles={data.themeCollection.items[0].linkedFrom.entryCollection.items} />
  {/await}
</nav>
{/if}

{#if !noComments}
<Comments />
{/if}
{/key}


<style lang="scss">
  article {
    color: var(--color);

    :global(p),
    :global(ul),
    :global(ol),
    :global(h1),
    :global(h2),
    :global(h3),
    :global(h4),
    :global(h5),
    :global(h6),
    :global(figure) {
      max-width: 42rem;
      margin-left: auto;
      margin-right: auto;
    }

    :global(figure) {
      max-width: 66rem;
    }
  }

  h1 {
    text-transform: uppercase;
    max-width: 1200px;
    margin: 0 auto;
  }

  aside {
    // font-size: 1.5rem;
  }

  .info {
     
    span {
      border: 1px solid;
      padding: 0 0.5em;
    }
  }

  nav {
    color: var(--light);
    background-color: var(--color);

    > center {
      margin-bottom: 2rem;
    }
  }
</style>