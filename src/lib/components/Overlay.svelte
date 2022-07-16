<script lang="ts">
  import { browser } from '$app/env'

  import { onMount } from 'svelte'
  import { fade, fly } from 'svelte/transition'

  export let open: boolean = false
  export let onClose: Function = undefined

  $: browser && document.documentElement.classList.toggle('noscroll', open)
</script>

{#if open}
<aside>
  <button transition:fade on:click={() => {
    open = false
    onClose && onClose()
  }} area-label="Close" />
  <slot />
</aside>
{/if}

<style lang="scss">
  aside {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 15;
    overflow-y: auto;
    
    > button {
      position: fixed;
      inset: 0;
      z-index: -1;
      // background: transparent;
      // border: none;
      background-color: rgba(255, 255, 255, 0.33);
      -webkit-backdrop-filter: blur(20px);
      backdrop-filter: blur(20px);

      border: none;
      border-radius: 0;

      // cursor: url(/close.png) 0 0, pointer;
    }
  }
</style>