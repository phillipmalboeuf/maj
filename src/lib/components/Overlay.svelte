<script lang="ts">
  import { browser } from '$app/environment'

  import { onDestroy, onMount } from 'svelte'
  import { fade, fly } from 'svelte/transition'

  export let open: boolean | string = false
  export let onClose: Function = undefined

  $: browser && document.documentElement.classList.toggle('noscroll', !!open)

  onDestroy(() => {
    if (browser) {
      document.documentElement.classList.remove('noscroll')
    }
  })
</script>

{#if open}
<aside>
  <button transition:fade on:click={() => {
    open = false
    onClose && onClose()
  }} aria-label="Fermer" />
  <slot />
</aside>
{/if}

<style lang="scss">
  aside {
    --height: 100vh;
    @supports (height: 100dvh) {
      --height: 100dvh;
    }

    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: var(--height);
    z-index: 15;
    overflow-y: auto;
    
    > button {
      position: fixed;
      inset: 0;
      z-index: -1;
      // background: transparent;
      // border: none;
      background-color: rgba(255, 255, 255, 0.66);
      -webkit-backdrop-filter: blur(20px);
      backdrop-filter: blur(20px);

      border: none;
      border-radius: 0;

      // cursor: url(/close.png) 0 0, pointer;
    }
  }
</style>