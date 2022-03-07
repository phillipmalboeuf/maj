<script lang="ts">
  import type { ArticleDocument } from '$routes/articles/index.svelte'
  import { DateTime } from 'luxon'
  import Picture from './Picture.svelte'

  export let articles: ArticleDocument[]
</script>

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

<style lang="scss">
  ol {
    list-style: none;
    padding: 0;
  }
</style>