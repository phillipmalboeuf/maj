<script lang="ts">
import { swipe } from 'svelte-gestures';

  import Text from './Text.svelte'

  export let entry: {
    titre: string
    titreInvisible: boolean
    colonnes: number
    alignement: string
    slidesCollection: {
      items: {
        titre: string;
        titreInvisible: boolean;
        pleinePage: boolean;
        media: object;
        corps: {
            json: object;
        };
    }[]
    }
  }

  let current = 0
  let length = entry.slidesCollection.items.length

  function prev() {
    current = current === 0 ? current = length - 1 : current - 1
  }

  function next() {
    current = current === length - 1 ? current = 0 : current + 1
  }
</script>


<article>
  {#if !entry.titreInvisible}<h2 class="d2 center">{entry.titre}</h2>{/if}
  {#if entry.slidesCollection}
  <div class="flex" style="width: {length * 66}%; transform: translateX({(current * -(100 / length))}%)" use:swipe={{ timeframe: 500, minSwipeDistance: 25, touchAction: 'pan-y' }} on:swipe={(e) => {
    if (e.detail.direction === 'right') {
      prev()
    } else {
      next()
    }
  }}>
    {#each entry.slidesCollection.items as slide}
    <Text entry={slide} />
    {/each}
  </div>
  {/if}

  <center>
    <button on:click={prev} class="arrow arrow--prev">←</button>
    <button on:click={next} class="arrow arrow--next">→</button>
  </center>
</article>

<style lang="scss">
  article {
    width: 100%;
    overflow-x: hidden;
    cursor: ew-resize;
  }

  h2 {
    margin-top: var(--gutter);
  }

  div {
    text-align: center;
    transition: transform 666ms;
    -webkit-user-select: none;
    user-select: none;

    :global(div) {
      color: var(--color) !important;
    }
  }

  center {
    margin-bottom: var(--gutter);

    button {
      color: var(--color)
    }
  }
</style>
