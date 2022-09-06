<script lang="ts">
  import { fade, fly } from 'svelte/transition'
  import Overlay from './Overlay.svelte'

  export let media: any
  export let small = false
  export let noDescription = false
  export let ar = undefined
  export let eager = false
  export let zoom = false
  export let label: string = undefined
  export let maxHeight = false

  export let noLink = false

  let open: boolean
  let x: number
  let y: number
  let labelVisible: boolean
  // let timeout

  function move(e: PointerEvent & { currentTarget: HTMLElement }) {
    if (label) {
      labelVisible = true
      x = e.x + window.scrollX
      y = e.y + window.scrollY

      // clearTimeout(timeout)
      // timeout = setTimeout(() => {
      //   labelVisible = false
      // }, 333)
    }
  }
</script>

<style lang="scss">
  img,
  video {
    width: 100%;
    max-width: 100%;

    &.maxHeight {
      max-height: 66vh;
      object-fit: contain;

      &:not(.beat) {
        background-color: var(--color);
      }
    }

    &.zoom {
      cursor: zoom-in;
    }

    &.label {
      cursor: none;
    }
  }

  a {
    display: block;
    width: 100%;
    max-width: 100%;
    text-align: center;

    svg {
      margin: 0 auto;
    }
  }

  figure {
    pointer-events: none;
    padding: var(--gutter);
    min-height: 100vh;
    margin: 0;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;

    :global(img) {
      max-height: calc(100vh - (var(--gutter) * 2));
      object-fit: contain;
    }
  }

  span {
    pointer-events: none;
    position: absolute;
    color: var(--light);
    background-color: var(--color);
    // -webkit-backdrop-filter: blur(20px);
    // backdrop-filter: blur(20px);
    border: 1px solid transparent;
    padding: 0.5em;
  }

  .beat {
    animation: beat .666s infinite alternate;
    transform-origin: center;
  }

  @keyframes beat{
    to { transform: scale(0.75); }
  }
</style>

{#if media}
{#if media.title !== '[SPACER]'}
{#if media.contentType?.startsWith('video/')}
<video class:zoom class:label class:maxHeight src="{media.url}" autoplay muted loop playsinline />
{:else if !noLink && media.title?.startsWith('http')}
<a href={media.title} target="_blank" rel="external">
  <svelte:self {media} {small} {ar} {eager} noLink />
</a>
{:else if media.contentType?.startsWith('image/')}
<picture>
  {#if small}
<source srcSet="{media.url}?w=400{ar ? `&h=${Math.round(ar * 400)}&fit=fill` : ''}" media="(max-width: 900px)" />
<source srcSet="{media.url}?w=600{ar ? `&h=${Math.round(ar * 600)}&fit=fill` : ''}" media="(max-width: 1200px)" />
<img class:zoom class:label class:maxHeight on:click={() => open = true} style={ar ? `aspect-ratio: 800 / ${Math.round(ar * 800)}` : `aspect-ratio: ${media.width} / ${media.height}`} src="{media.url}?w=800{ar ? `&h=${Math.round(ar * 800)}&fit=fill` : ''}" alt="{media.title} {media.description}" loading={eager ? "eager" : "lazy"} />
  {:else}
<source srcSet="{media.url}?w=900{ar ? `&h=${Math.round(ar * 900)}&fit=fill` : ''}" media="(max-width: 900px)" />
<source srcSet="{media.url}?w=1200{ar ? `&h=${Math.round(ar * 1200)}&fit=fill` : ''}" media="(max-width: 1200px)" />
<img class:zoom class:label class:maxHeight class:beat={media.title === 'Heartbeat'} on:pointermove={move} on:pointerleave={() => labelVisible = false} on:click={() => open = true} style={ar ? `aspect-ratio: 1800 / ${Math.round(ar * 1800)}` : `aspect-ratio: ${media.width} / ${media.height}`} src="{media.url}?w=1800{ar ? `&h=${Math.round(ar * 1800)}&fit=fill` : ''}" alt="{media.title} {media.description}" loading={eager ? "eager" : "lazy"} />
  {/if}
</picture>
{:else}
<svg width="310" height="310" viewBox="0 0 310 310" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="155.254" cy="155.255" r="149.155"/>
  <path d="M234.961 141.763C244.931 147.519 244.931 161.909 234.961 167.666L126.777 230.126C116.807 235.882 104.344 228.687 104.344 217.174L104.344 92.2541C104.344 80.7418 116.807 73.5466 126.777 79.3027L234.961 141.763Z" />
</svg>
{/if}

{#if !noDescription && media.title !== 'Heartbeat' && (media.title || media.description) && !media.title?.startsWith('http')}
<p class="small">{media.title} {media.description || ''}</p>
{/if}

{#if label && labelVisible}
<span style="top: {y}px; left: {x}px;">{label}</span>
{/if}

{#if zoom}
<Overlay bind:open={open}>
  <figure transition:fade>
    <svelte:self {media} />
  </figure>
</Overlay>
{/if}
{/if}
{/if}