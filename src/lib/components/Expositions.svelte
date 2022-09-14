<script lang="ts">
import { date } from '$lib/formatters';

  import { DateTime } from 'luxon'
  import type { ExpositionDocument } from 'src/routes/expositions/[id]/index.svelte'
  import Picture from './Picture.svelte'

  export let expositions: ExpositionDocument[]
  export let tight = false
</script>

<ol class={tight ? "flex flex--supertight flex--end" : "grid grid--halves"}>
  {#each expositions as exposition, i}
  <li class={tight ? 'flex__sixth' : i === 0 && 'span__2'}>
    <a href="/expositions/{exposition.id}/oeuvres?type=mur">
      <figure>
        {#if tight}
        <figcaption class="flex flex--spaced">
          <span>{exposition.titreCourt || exposition.titre}</span>
          <span>{date(exposition.debut)}</span>
        </figcaption>
        {/if}
        {#if exposition.media}
        <Picture media={exposition.media} noDescription label="Voir l'exposition" />
        {:else if exposition.oeuvresCollection?.items}
        <Picture media={exposition.oeuvresCollection?.items[0].media} noDescription label="Voir l'exposition" />
        {/if}
        {#if !tight}
        <figcaption class="flex flex--spaced">
          <span>{exposition.curatorsCollection.items.map(personne => [personne.nom].join(', ')).join(', ')}</span>
          <span>{date(exposition.debut)}</span>
        </figcaption>
        {/if}
      </figure>
      {#if !tight}<h3>{exposition.titre}</h3>{/if}
    </a>
  </li>
  {/each}
</ol>

<style lang="scss">
  ol {
    list-style: none;
    padding: 0;
  }

  figure {
    margin-bottom: 0;
  }
</style>