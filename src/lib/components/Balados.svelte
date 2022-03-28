<script lang="ts">
  import { DateTime } from 'luxon'
  import type { BaladoDocument } from 'src/routes/balados/index.svelte'
  import Audio from './Audio.svelte'
  import Document from './document/Document.svelte'
  import Picture from './Picture.svelte'

  export let balados: BaladoDocument[]
  
  let durations: {[id: string]: string} = {}
  let selected: string
</script>

<h2 class="center">Écouter</h2>

<ol class:selected>
  {#each balados as balado}
  <li class="flex flex--spaced" class:selected={selected === balado.id} on:click={() => selected = balado.id}>
    <figure class="grid">
      {#if selected === balado.id}
      <figcaption>
        <p><strong>{balado.titre}</strong></p>
        <Document body={balado.introduction} />
        {#if balado.liens}
        {#each Object.entries(balado.liens) as [label, href]}
        <a {href} target="_blank" class="button">{label}</a><br>
        {/each}
        {/if}
      </figcaption>
      {/if}
      <Picture media={balado.image} />
      <Audio controls={selected === balado.id} media={balado.audio} bind:duration={durations[balado.id]} />
    </figure>

    <span>{balado.titre}</span>
    <span>{balado.titreCourt}</span>
    <span>{balado.date && DateTime.fromISO(balado.date).toFormat('yyyy.ll.dd')}</span>
    <span>{durations[balado.id]}</span>
    <!--  -->
    
    <!-- <figure>
      <Audio media={balado.audio} bind:duration={durations[balado.id]} />

      <figcaption class="flex flex--spaced">
        <span>{balado.date && DateTime.fromISO(balado.date).toFormat('yyyy.ll.dd')}</span>
        <span>{durations[balado.id]}</span>
      </figcaption>
    </figure> -->
  </li>
  {/each}
</ol>

<style lang="scss">
  ol {
    list-style: none;
    padding: 0;

    &.selected {
      position: relative;
      padding-top: 33vh;
    }

    li {
      cursor: pointer;
      padding: calc(var(--gutter) / 2);
      border-top: 1px solid var(--dark-grey);
      max-width: 678px;
      margin: 0 auto;

      figure {
        position: absolute;
        top: 0;
        left: 0;
      }

      &:not(.selected) {
        figure {
          display: none;
        }
      }
    }
  }

  .button {
    margin-bottom: 0.5em;
  }
</style>