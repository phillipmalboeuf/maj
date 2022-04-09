<script lang="ts">
  import { DateTime } from 'luxon'
  import type { ArticleDocument } from 'src/routes/articles/index.svelte'
  import Picture from './Picture.svelte'

  export let articles: ArticleDocument[]
  export let thirds = false
</script>

<ol class="grid {thirds ? 'grid--thirds' : 'grid--halves'}">
  {#each articles as article}
  <li class={article.vedette && 'span__2'}>
    <a href="/{{
      'Article': 'articles',
      'Activity': 'activites',
      'Balado': 'balados'
    }[article.__typename] || 'articles'}/{article.id}">
      <figure>
        <Picture media={article.media} noDescription label={{
          'Article': 'Lire l\'article',
          'Activity': 'Lire l\'activité',
          'Balado': 'Écouter le balado'
        }[article.__typename] || 'Lire l\'article'} />
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

<style lang="scss">
  ol {
    list-style: none;
    padding: 0;
  }
</style>