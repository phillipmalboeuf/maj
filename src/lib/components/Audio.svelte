<script lang="ts">
  import { onMount } from 'svelte'
  import { Duration } from 'luxon'

  export let media: any
  export let visible: boolean = true
  export let duration: number = undefined
  export let currentTime: number = 0
  export let paused: boolean = true

  let element: HTMLAudioElement
</script>



{#if media}
<audio bind:this={element} bind:paused bind:duration bind:currentTime src={media.url} />
{#if visible}
<figure class="flex flex--wrap flex--middle">

  <span>{currentTime ? Duration.fromMillis(currentTime*1000).toFormat('mm:ss') : '00:00'}</span>

  <button class:paused on:click={() => paused ? element.play() : element.pause()}>
    <svg width="310" height="310" viewBox="0 0 310 310" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="155.254" cy="155.255" r="149.155"/>
    {#if !paused}
    <path d="M117 61V243" stroke-width="30"/>
    <path d="M193 61V243" stroke-width="30"/>
    {:else}
    <path d="M234.961 141.763C244.931 147.519 244.931 161.909 234.961 167.666L126.777 230.126C116.807 235.882 104.344 228.687 104.344 217.174L104.344 92.2541C104.344 80.7418 116.807 73.5466 126.777 79.3027L234.961 141.763Z" />
    {/if}
    </svg>
  </button>

  <span>{duration ? Duration.fromMillis(duration*1000).toFormat('mm:ss')  : '--:--'}</span>

  <input id="time" name="time" type="range" value={currentTime} min={0} step={0.01} max={duration}
    on:input={e => currentTime = e.currentTarget.valueAsNumber} />
</figure>
{/if}
{/if}


<style lang="scss">
  figure {
    max-width: 677px;
    margin: 0 auto var(--gutter);

    span {
      flex: 1;

      &:last-of-type {
        text-align: right;
      }
    }
  }

  button {
    border: none;
    padding: 0;

    @media (max-width: 888px) {
      svg {
        width: 200px !important;
        height: 200px !important;
      }
    }

    path,
    circle {
      stroke: var(--color);
      fill: none;
      transition: stroke 333ms, fill 333ms;
    }

    &:hover,
    &:focus {
      circle {
        fill: var(--color);
      }

      path {
        fill: var(--light);
      }

      path[stroke-width] {
        stroke: var(--light);
      }
    }
  }

  :global(.dark) button {
    &:hover,
    &:focus {
    path { 
      stroke: var(--dark);
    }
    }
  }

  input[type="range"] {
    width: 100%;
    margin: calc(var(--gutter)/2) 0 0;

    cursor: pointer;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;

    height: 1px;
    background: var(--color);
  }

  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 1.25em;
    height: 1.25em;
    border-radius: 50%;
    background: var(--color);
    transition: border-radius 333ms;
  }
  input[type="range"]:hover::-webkit-slider-thumb {
    border-radius: 0;
  }

  input[type="range"]::-moz-range-thumb {
    -moz-appearance: none;
    width: 1.25em;
    height: 1.25em;
    border-radius: 50%;
    background: var(--color);      
    transition: border-radius 333ms;
  }
  input[type="range"]:hover::-webkit-slider-thumb {
    border-radius: 0;
  }
</style>