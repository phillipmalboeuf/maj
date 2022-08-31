<script lang="ts">
  import { date } from '$lib/formatters'

  import type { ArticleDocument } from 'src/routes/articles/index.svelte'
  import Picture from './Picture.svelte'

  export let articles: ArticleDocument[]
  export let thirds = false
  export let archives = false
  export let tight = false

  export let p: number = undefined
</script>

<ol class="grid {thirds ? 'grid--thirds' : 'grid--halves'}{archives ? ' grid--tight' : ''}{tight ? ' grid--supertight' : ''}">
  {#each articles as article}
  <li class={!archives && article.vedette && 'span__2'}>
    <a href="/{{
      'Article': 'articles',
      'Activity': 'activites',
      'Balado': 'balados'
    }[article.__typename] || 'articles'}/{article.id}">
      <figure>
        {#if archives}
        <figcaption class="flex flex--nogap flex--spaced flex--wrap">
          <h5>{article.titreCourt || article.titre}</h5>
          <span>–</span>
          <span>{{
            'Article': 'Article',
            'Activity': 'Activité',
            'Balado': 'Balado'
          }[article.__typename] || 'Article'}</span>
          <span>{date(article.date)}</span>
        </figcaption>
        {/if}
        <Picture media={article.media} noDescription label={{
          'Article': 'Lire l\'article',
          'Activity': 'Lire l\'activité',
          'Balado': 'Écouter le balado'
        }[article.__typename] || 'Lire l\'article'} />
        {#if !archives}<figcaption class="flex flex--spaced">
          <span>{article.personnesCollection?.items.map(personne => [personne.nom].join(', ')).join(', ')}</span>
          <span>{date(article.date)}</span>
        </figcaption>{/if}
      </figure>
      {#if !archives}<h3>{article.titreCourt || article.titre}</h3>{/if}
    </a>
  </li>
  {/each}
</ol>

{#if p !== undefined}
<div class="flex flex--center">
  {#if p > 0}
  <a href="/{{
      'Article': 'articles',
      'Activity': 'activites',
      'Balado': 'balados'
    }[articles[0].__typename] || 'articles'}?p={p-1}" class="button">Articles précédents</a>
  {/if}

  <a href="/{{
      'Article': 'articles',
      'Activity': 'activites',
      'Balado': 'balados'
    }[articles[0].__typename] || 'articles'}?p={p+1}" class="button">Articles suivants</a>
</div>
{/if}

<style lang="scss">
  ol {
    list-style: none;
    padding: 0;

    &.grid--tight {
      max-width: 66rem;
      margin: 0 auto;
    }
  }

  figure {
    margin-bottom: 0;
  }

  figcaption {

    &.flex--wrap {
      padding: 0.5rem;
      // margin-bottom: 0.5rem;

      h5 {
        margin-bottom: 0;
      }

      > *:nth-child(2n - 1) {
        width: 66%;
      }
    }
  }
</style>