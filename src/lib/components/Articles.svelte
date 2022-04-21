<script lang="ts">
  import { DateTime } from 'luxon'
  import type { ArticleDocument } from 'src/routes/articles/index.svelte'
  import Picture from './Picture.svelte'

  export let articles: ArticleDocument[]
  export let thirds = false
  export let archives = false
</script>

<ol class="grid {thirds ? 'grid--thirds' : 'grid--halves'}{archives ? ' grid--tight' : ''}">
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
          <span>{article.date && DateTime.fromISO(article.date).toFormat('yyyy.ll.dd')}</span>
        </figcaption>
        {/if}
        <Picture media={article.media} noDescription label={{
          'Article': 'Lire l\'article',
          'Activity': 'Lire l\'activité',
          'Balado': 'Écouter le balado'
        }[article.__typename] || 'Lire l\'article'} />
        {#if !archives}<figcaption class="flex flex--spaced">
          <span>{article.personnesCollection?.items.map(personne => [personne.nom].join(', ')).join(', ')}</span>
          <span>{article.date && DateTime.fromISO(article.date).toFormat('yyyy.ll.dd')}</span>
        </figcaption>{/if}
      </figure>
      {#if !archives}<h3>{article.titreCourt || article.titre}</h3>{/if}
    </a>
  </li>
  {/each}
</ol>

<style lang="scss">
  ol {
    list-style: none;
    padding: 0;

    &.grid--tight {
      max-width: 66rem;
      margin: 0 auto;
    }
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