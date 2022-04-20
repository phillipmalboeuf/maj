<script lang="ts">
  import { DateTime } from "luxon"
  import { onMount } from 'svelte'

  import type { PageDocument } from '$lib/components/Page.svelte'
  import type { ArticleDocument } from '../../routes/articles/index.svelte'
  import Document from '$lib/components/document/Document.svelte'
  
  import Picture from '$lib/components/Picture.svelte'
  import Contenu from '$lib/components/Contenu.svelte'
  import Comments from '$lib/components/Comments.svelte'


	export let page: PageDocument
  export let article: ArticleDocument

  let type = article.__typename.toLowerCase()


  let readingTime: number
  let element: HTMLElement
  const wpm = 200

  onMount(() => {
    readingTime = Math.ceil(element.innerText.trim().split(/\s+/).length / wpm)
  })
</script>


<article bind:this={element} class="padded">
  <h2 class="center">{page.titre}</h2>
  
  <br>

  <center>
    <a href="/{{ 'activity': 'activite' }[type] || type}s" class="button">←</a>
  </center>

  <br>

  <h1 class="d1 center">{article.titre}</h1>
  
  <br>

  <div class="flex flex--center info">
    <span>{article.date && DateTime.fromISO(article.date).toFormat('yyyy.ll.dd')}</span>
    {#if article.personnesCollection}<span>{article.personnesCollection.items.map(personne => [personne.nom, personne.position].join(', ')).join(', ')}</span>{/if}
    <span>{readingTime} min</span>
  </div>

  <br>
  <br>

  {#if article.media}
  <figure>
    <Picture media={article.media} />
  </figure>
  {/if}

  <aside><Document body={article.intro} /></aside>
  {#if article.contenuCollection}<Contenu contenu={article.contenuCollection.items} />{/if}

  <slot />
</article>

<Comments />

<!-- {#if article.theme}
<nav class="padded center" style="background-color: var(--{page.couleur?.toLowerCase()});">
  <button>Explorer davantage dans notre archive</button>
  {#await query(fetch, `
      query($themeId: String!) {
        articleCollection(limit: 9, where: {theme: { id: $themeId }}) {
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
      themeId: article.theme.id
    })}
    ...
  {:then { data }}
  <div class="flex flex--center flex--nogap">
    {#each data.articleCollection.items as a}
    <a href="/articles/{a.id}">
      <figure>
        <Picture media={a.media} noDescription />
        <figcaption>{a.titreCourt || a.titre}</figcaption>
      </figure>
    </a>
    {/each}
  </div>
  {/await}
</nav>
{/if} -->


<style lang="scss">
  article {
    color: var(--color);
  }

  h1 {
    margin-bottom: 0;
  }

  aside {
    font-size: 1.5rem;
  }

  .info {
     
    span {
      border: 1px solid;
      padding: 0 0.5em;
    }
  }

  // nav {
  //   color: var(--light);

  //   > div {
  //     margin-top: 2rem;
  //   }

  //   a {
  //     text-align: left;
  //     max-width: 25%;

  //     figcaption {
  //       opacity: 0;
  //       transform: translateY(10px);
  //       transition: opacity 333ms, transform 333ms;
  //     }

  //     &:hover,
  //     &:focus {
  //       figcaption {
  //         opacity: 1;
  //         transform: translateY(0);
  //       }
  //     }
  //   }
  // }
</style>