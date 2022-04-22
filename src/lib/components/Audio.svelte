<script lang="ts">
  import { onMount } from 'svelte'
  import { Duration } from 'luxon'

  export let media: any
  export let visible: boolean = true
  export let duration: number = undefined
  export let currentTime: number= undefined

  let element: HTMLAudioElement
</script>



{#if media}
<audio bind:this={element} bind:duration bind:currentTime src={media.url} />
{#if visible}
<figure class="flex flex--wrap flex--middle">

  <span>{currentTime ? Duration.fromMillis(currentTime*1000).toFormat('mm:ss') : '00:00'}</span>

  <button on:click={() => element.paused ? element.play() : element.pause()}>
    <svg width="300" height="300" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="149.921" cy="149.922" r="149.155" stroke="#2F73D9"/>
    <path d="M229.628 162.333L121.444 224.793C111.474 230.549 99.0116 223.354 99.0116 211.842L99.0116 86.9216C99.0116 75.4093 111.474 68.2141 121.444 73.9702L229.628 136.43C239.598 142.187 239.598 156.577 229.628 162.333Z" stroke="#2F73D9"/>
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

    path {
      fill: none;
    }
  }

  input[type="range"] {
    width: 100%;
    margin: calc(var(--gutter)/2) 0 0;

    cursor: col-resize;
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
  }

  input[type="range"]::-moz-range-thumb {
    -moz-appearance: none;
    width: 1.25em;
    height: 1.25em;
    border-radius: 50%;
    background: var(--color);      
  }
</style>