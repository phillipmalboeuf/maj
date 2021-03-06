<script context="module" lang="ts">
  export interface OeuvreDocument {
    titre: string
    id: string
    description?: object
    media?: object
    date: string
    bref: string
  }
</script>

<script lang="ts">
  import type { ExpositionDocument } from 'src/routes/expositions/[id]/index.svelte'
  import type { SoumissionDocument } from 'src/routes/forms/[form_id]/soumissions/[id].svelte'

  import { onMount } from 'svelte'

  import Document from './document/Document.svelte'
  import OeuvreOverlay from './OeuvreOverlay.svelte'
  import Picture from './Picture.svelte'
  import Slider from './Slider.svelte'

  export let exposition: ExpositionDocument
  export let oeuvres: SoumissionDocument[]
  export let type = 'columns'

  let list: HTMLUListElement

  onMount(async () => {
    if (list) {
      const Masonry = (await import('masonry-layout')).default
      const msnry = new Masonry(list, {
        itemSelector: 'li',
        gutter: 8
      })

      return () => msnry.destroy()
    }
  })

  let open: string
</script>

{#if type === 'columns'}
<ul class="grid">
  {#each oeuvres as oeuvre}
  <li>
    <figure>
      <Picture media={oeuvre.media} />
    </figure>

    <aside>
      <h6>{oeuvre.titre}</h6>
      {#if oeuvre.description}
      <Document body={oeuvre.description} />
      {:else}
      <p>{oeuvre.bref}</p>
      {/if}
    </aside>
  </li>
  {/each}
</ul>
{:else if type === 'mur'}
<ul bind:this={list} class="masonry">
  {#each oeuvres as oeuvre, i}
  <li>
    <a href="/expositions/{exposition.id}/oeuvres/{oeuvre.id}"
        on:click|preventDefault={() => open = oeuvre.id}>
      <figure>
        <Picture media={oeuvre.media} ar={i % 2 ? 1 : 2} />
      </figure>
    </a>
  </li>

    {#if open === oeuvre.id}
    <OeuvreOverlay bind:open={open} {oeuvre} />
    {/if}
  {/each}
</ul>
{:else if type === 'slider'}
<ul class="slider">
  <Slider particlesToShow={4}>
    {#each oeuvres as oeuvre, i}
    <li>
      <figure>
        <Picture media={oeuvre.media} ar={i % 2 ? 1 : 2} />
      </figure>
    </li>
    {/each}
  </Slider>
</ul>
{/if}

<style lang="scss">

  ul {
    list-style: none;
    padding: 0;
  }

  .slider {

    li {
      -webkit-user-select: none;
      user-select: none;

      figure {
        pointer-events: none;
        padding: 0 calc(var(--small) / 2);
      }
    }
  }

  .masonry {
    li {
      display: inline-block;
      width: calc(33% - 8px);
      vertical-align: top;

      figure,
      figure :global(p) {
        margin-bottom: calc(var(--small) / 3);
      }
    }
  }

  aside {
    color: var(--dark);
  }
</style>