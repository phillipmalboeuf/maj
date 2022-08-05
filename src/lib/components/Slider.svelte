<script lang="ts">
  import { onMount, tick } from 'svelte'
  import emblaCarouselSvelte, { type EmblaCarouselType } from 'embla-carousel-svelte'
  import AutoHeight from 'embla-carousel-auto-height'
  import AutoPlay from 'embla-carousel-autoplay'
  // import { swipe } from 'svelte-gestures'

  // import Text from './Text.svelte'

  // export let entry: {
  //   titre: string
  //   titreInvisible: boolean
  //   colonnes: number
  //   alignement: string
  //   slidesCollection: {
  //     items: {
  //       titre: string;
  //       titreInvisible: boolean;
  //       pleinePage: boolean;
  //       media: object;
  //       corps: {
  //           json: object;
  //       };
  //   }[]
  //   }
  // }
  export let autoplay = false
  export let arrows = true
  export let particlesToShow: number = undefined

  let embla: EmblaCarouselType

  // let Carousel
  // let carousel
  // onMount(async () => {
  //   const module = await import('svelte-carousel')
  //   Carousel = module.default
  // })

  let down = false
  export let swiping = false

  // let current = 0
  // let length = entry.slidesCollection.items.length

  function prev() {
    embla.scrollPrev()
  }

  function next() {
    embla.scrollNext()
  }

  // onMount(() => {
  //   if (autoplay) {
  //     const interval = window.setInterval(() => {
  //       if (!paused) { next() }
  //     }, 3000)

  //     return () => window.clearInterval(interval)
  //   }

  // })
</script>

<article>
  <div class:swiping
    on:pointerdown={() => {
      down = true
    }}
    on:pointermove={() => {
      if (down && !swiping) { swiping = true }
    }}
    on:pointerup={async () => {
      down = false
      setTimeout(() => swiping = false, 200)
    }}>
  <div class="embla"
    use:emblaCarouselSvelte={{
      options: {
        loop: true,
        slidesToScroll: particlesToShow > 1 ? 2 : 1
      },
      plugins: [AutoHeight(), AutoPlay({ stopOnMouseEnter: true, playOnInit: autoplay })]
    }}
    on:init={event => embla = event.detail}
    style="--width: {100/particlesToShow}%;"
  >
    <div class="embla__container">
      <slot />
    </div>
  </div>
  </div>

  {#if arrows}
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
  {/if}
</article>

<!-- <article
  on:pointerenter={() => {
    if (autoplay) { paused = true }
  }}
  on:pointerleave={() => {
    if (autoplay) { paused = false }
  }}>
  
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
</article> -->

<style lang="scss">
  article {
    width: 100%;
    overflow-x: hidden;
    cursor: ew-resize;
  }

  .embla {
    overflow: hidden;
  }

  .embla__container {
    display: flex;
    align-items: flex-start;
    transition: height 333ms;

    > :global(li) {
      flex: 0 0 var(--width);
      color: var(--color) !important;
    }

    :global(figure) {
      padding: 0 calc(var(--small) / 6);
    }
  }

  center {
    margin-bottom: var(--gutter);

    button {
      color: var(--color);
      border: none;
      transition: transform 333ms;

      &:hover,
      &:focus {
        transform: translateX(var(--small));

        &:first-child {
          transform: translateX(calc(var(--small) * -1));
        }
      }
    }
  }
</style>
