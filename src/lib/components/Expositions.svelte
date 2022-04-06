<script lang="ts">
  import { DateTime } from 'luxon'
  import type { ExpositionDocument } from 'src/routes/expositions/[id].svelte'
  import Picture from './Picture.svelte'

  export let expositions: ExpositionDocument[]
</script>

<ol class="grid grid--halves">
  {#each expositions as exposition}
  <li>
    <a href="/expositions/{exposition.id}">
      <figure>
        <Picture media={exposition.media} noDescription label="Voir l'exposition" />
        <figcaption class="flex flex--spaced">
          <span>{exposition.curatorsCollection.items.map(personne => [personne.nom].join(', ')).join(', ')}</span>
          <span>{exposition.debut && DateTime.fromISO(exposition.debut).toFormat('yyyy.ll.dd')}</span>
        </figcaption>
      </figure>
      <h3>{exposition.titreCourt || exposition.titre}</h3>
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