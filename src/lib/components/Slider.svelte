<script lang="ts">
  import { swipe } from 'svelte-gestures'

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
  <div class="flex flex--tight" style="width: {length * 66}%; transform: translateX({(current * -(100 / length)) + 8}%)" use:swipe={{ timeframe: 500, minSwipeDistance: 25, touchAction: 'pan-y' }} on:swipe={(e) => {
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
    <button on:click={prev} class="arrow arrow--prev">
      <svg width="99" height="32" viewBox="0 0 99 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line y1="-0.575" x2="60.624" y2="-0.575" transform="matrix(1 8.74228e-08 8.74228e-08 -1 37.876 15.2329)" stroke="currentColor" stroke-width="1.15"/>
      <path d="M15.476 31.616L0.499973 15.808L15.476 0H17.076L2.67598 15.232H37.876V16.384H2.67598L17.076 31.616H15.476Z" fill="currentColor"/>
      </svg>
    </button>
    <button on:click={next} class="arrow arrow--next">
      <svg width="106" height="32" viewBox="0 0 106 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="68.124" y1="15.8079" x2="0.500031" y2="15.8079" stroke="currentColor" stroke-width="1.15"/>
      <path d="M90.524 31.616L105.5 15.808L90.524 0H88.924L103.324 15.232H68.124V16.384H103.324L88.924 31.616H90.524Z" fill="currentColor"/>
      </svg>
    </button>
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
      color: var(--color);
      border: none;
    }
  }
</style>
