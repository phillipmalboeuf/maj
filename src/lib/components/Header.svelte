<script lang="ts">
  import { fade, fly } from 'svelte/transition'
  import Logo from './Logo.svelte'

  let visible = false
</script>

<header id="header">
  <span class="padded">
    <a href="/#top" aria-label="Accueil">
      <Logo />
    </a>
  </span>

  {#if visible}
  <nav class="padded" transition:fly={{ y: -100 }}>
    <a class="h4" href="/">Expositions</a>
    <a class="h4" href="/">Explorer</a>
    <a class="h4" href="/">À propos</a>
    <a class="h4" href="/">Participer</a>
    <a class="h4" href="/">Soutenir ce projet</a>
    <a class="h4" href="/">Se connecter</a>
    <a class="h4" href="/">Profil</a>
    <a class="h4" href="/">En</a>
  </nav>
  {/if}

  <span class="padded">
    <button on:click={() => visible = !visible}>
      {#if visible}Close{:else}Menu{/if}
    </button>
  </span>
</header>

<style lang="scss">
  header {
    color: var(--color);
    pointer-events: none;

    a, button {
      pointer-events: auto;
    }

    nav,
    > span {
      position: fixed;
      z-index: 10;
      top: 0;
      left: 0;
    }

    nav {
      z-index: 9;
      width: 100vw;
      background: linear-gradient(180deg, rgba(251, 251, 251, 0.81) 97.4%, rgba(251, 251, 251, 0) 100%);
      -webkit-backdrop-filter: blur(20px);
      backdrop-filter: blur(20px);
      padding-top: calc(var(--gutter) / 2);
      padding-left: 24rem;

      > a {
        display: block;
        margin-bottom: 0.33em;
        text-decoration: none;
      }
    }

    > span:last-child {
      left: auto;
      right: 0;
    }
  }
</style>