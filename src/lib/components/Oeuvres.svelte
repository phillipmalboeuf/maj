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

  import Document from './document/Document.svelte'
  import Picture from './Picture.svelte'

  export let oeuvres: OeuvreDocument[]
  export let type = 'columns'

  // let list: HTMLUListElement

  onMount(async () => {
    // if (list) {
    //   const Masonry = (await import('masonry-layout')).default
    //   const msnry = new Masonry(list, {
    //     itemSelector: 'li',
    //     gutter: 8
    //   })

    //   return () => msnry.destroy()
    // }
  })

  let current: number = 0
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
{:else if type === 'grid'}
<ul class="grid grid--thirds">
  {#each [...oeuvres, ...oeuvres, ...oeuvres, ...oeuvres] as oeuvre, i}
  <li>
    <figure>
      <Picture media={oeuvre.media} ar={i % 2 ? 1 : 2} />
    </figure>
  </li>
  {/each}
</ul>
{:else if type === 'slider'}
<ul class="flex flex--nogap">
  {#each [...oeuvres, ...oeuvres, ...oeuvres, ...oeuvres] as oeuvre, i}
  {#if i < 7}
  <li class:current={current === i} on:click={() => current = i}>
    <figure>
      <Picture media={oeuvre.media} ar={i % 2 ? 1 : 2} />
    </figure>
  </li>
  {/if}
  {/each}
</ul>
{/if}

<style lang="scss">
  ul {
    list-style: none;
    padding: 0;
  }

    li {
      cursor: pointer;
      flex: 1;

      &.current {
        flex: 4;
      }
    }

  aside {
    color: var(--dark);
  }
</style>