<script lang="ts">
  import { onMount, tick } from 'svelte'
  import emblaCarouselSvelte, { type EmblaCarouselType } from 'embla-carousel-svelte'
  import AutoHeight from 'embla-carousel-auto-height'
  import AutoPlay from 'embla-carousel-autoplay'
  import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures'

  export let autoplay = false
  export let autoHeight = true
  export let arrows = true
  export let loop = true
  export let particlesToShow: number = undefined
  export let detach = false

  let embla: EmblaCarouselType
  let down = false
  export let swiping = false

  function prev() {
    embla.scrollPrev()
  }

  function next() {
    embla.scrollNext()
  }

  onMount(() => {
    if (embla) {
      return () => embla.destroy()
    }

  })
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
        dragFree: detach,
        loop,
        slidesToScroll: particlesToShow > 1 ? detach ? 4 : 2 : 1
      },
      plugins: [...autoHeight ? [AutoHeight()] : [], AutoPlay({ stopOnMouseEnter: true, playOnInit: autoplay }), WheelGesturesPlugin()]
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
    <button class:detach on:click={prev} class="arrow arrow--prev">
      {#if detach}
      <svg width="58" height="58" viewBox="0 0 58 58" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="-0.5" y="0.5" width="56.376" height="56.616" rx="28.188" transform="matrix(-1 0 0 1 56.375 0)" fill="#FBFBFB" fill-opacity="0.8"/>
      <path d="M24.975 44.616L9.999 28.808L24.975 13H26.575L12.175 28.232H47.375V29.384H12.175L26.575 44.616H24.975Z" fill="#B46E1C"/>
      <rect x="-0.5" y="0.5" width="56.376" height="56.616" rx="28.188" transform="matrix(-1 0 0 1 56.375 0)" stroke="#B46E1C"/>
      </svg>
      {:else}
      <svg width="99" height="32" viewBox="0 0 99 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line y1="-0.575" x2="60.624" y2="-0.575" transform="matrix(1 8.74228e-08 8.74228e-08 -1 37.876 15.2329)" stroke="currentColor" stroke-width="1.15"/>
      <path d="M15.476 31.616L0.499973 15.808L15.476 0H17.076L2.67598 15.232H37.876V16.384H2.67598L17.076 31.616H15.476Z" fill="currentColor"/>
      </svg>
      {/if}
    </button>
    <button class:detach on:click={next} class="arrow arrow--next">
      {#if detach}
      <svg width="58" height="58" viewBox="0 0 58 58" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0.5" y="0.5" width="56.376" height="56.616" rx="28.188" fill="#FBFBFB" fill-opacity="0.8"/>
      <path d="M32.4 44.616L47.376 28.808L32.4 13H30.8L45.2 28.232H10V29.384H45.2L30.8 44.616H32.4Z" fill="#B46E1C"/>
      <rect x="0.5" y="0.5" width="56.376" height="56.616" rx="28.188" stroke="#B46E1C"/>
      </svg>
      {:else}
      <svg width="106" height="32" viewBox="0 0 106 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="68.124" y1="15.8079" x2="0.500031" y2="15.8079" stroke="currentColor" stroke-width="1.15"/>
      <path d="M90.524 31.616L105.5 15.808L90.524 0H88.924L103.324 15.232H68.124V16.384H103.324L88.924 31.616H90.524Z" fill="currentColor"/>
      </svg>
      {/if}
    </button>
  </center>
  {/if}
</article>

<style lang="scss">
  article {
    position: relative;
    width: 100vw;
    overflow-x: hidden;
    cursor: ew-resize;
    margin: 0 calc(var(--gutter) * -1);
  }

  .embla {
    overflow: hidden;
  }

  .embla__container {
    display: flex;
    align-items: flex-start;
    transition: height 333ms;

    > :global(li),
    > :global(article) {
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

      &.detach {
        position: absolute;
        top: calc(var(--gutter) * 3);
        left: var(--gutter);

        &.arrow--next {
          left: auto;
          right: var(--gutter);
        }

        @media (max-width: 888px) {
          padding: 0;
          width: calc(var(--gutter) * 2.5);
        }
      }

      &:hover,
      &:focus {
        transform: translateX(calc(var(--small) * 0.5));

        &:first-child {
          transform: translateX(calc(var(--small) * -0.5));
        }
      }
    }
  }
</style>
