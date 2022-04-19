<script context="module" lang="ts">
  export interface OeuvreDocument {
    titre: string
    id: string
    description?: object
    media?: object
    date: string
  }
</script>

<script lang="ts">
  import { onMount } from 'svelte'
  import { swipe } from 'svelte-gestures'

  import Document from './document/Document.svelte'
  import Picture from './Picture.svelte'

  export let oeuvres: OeuvreDocument[]
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

  let current: number = 3
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
      <Document body={oeuvre.description} />
    </aside>
  </li>
  {/each}
</ul>
{:else if type === 'mur'}
<ul bind:this={list} class="masonry">
  {#each [...oeuvres, ...oeuvres, ...oeuvres, ...oeuvres] as oeuvre, i}
  <li>
    <figure>
      <Picture media={oeuvre.media} ar={i % 2 ? 1 : 2} />
    </figure>
  </li>
  {/each}
</ul>
{:else if type === 'slider'}
<ul class="flex flex--tight slider"
  use:swipe={{ timeframe: 500, minSwipeDistance: 25, touchAction: 'pan-y' }} on:swipe={(e) => {
    if (e.detail.direction === 'right') {
      if (current > 0) {
        current = current - 1
      }
    } else {
      if (current < [...oeuvres, ...oeuvres, ...oeuvres, ...oeuvres].length - 1) {
        current = current + 1
      }
    }
  }}
  style="width: {100 + (([...oeuvres, ...oeuvres, ...oeuvres, ...oeuvres].length - 7) * (100/7))}%; transform: translateX({(current - 3) * -(8)}%);">
  {#each [...oeuvres, ...oeuvres, ...oeuvres, ...oeuvres] as oeuvre, i}
  <li class:current={current === i}>
    <figure>
      <Picture media={oeuvre.media} ar={i % 2 ? 1 : 2} />
    </figure>
  </li>
  {/each}
</ul>
{/if}

<style lang="scss">

  ul {
    list-style: none;
    padding: 0;
  }

    .slider {
      cursor: ew-resize;
      transition: transform 333ms;

      li {
        flex: 1;
        transition: flex 333ms;
        -webkit-user-select: none;
        user-select: none;

        &.current {
          flex: 4;
        }

        figure {
          pointer-events: none;
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