<script lang="ts">
  import { fade, fly } from 'svelte/transition'
  import Logo from './Logo.svelte'

  let visible = false
</script>

<svelte:body on:click={() => visible = false} />

<header id="header">
  <span class="padded">
    <a href="/#top" aria-label="Accueil">
      <Logo />
    </a>
  </span>

  {#if visible}
  <nav class="padded" transition:fly={{ y: 0 }}>
    <a class="h4" href="/expositions">Expositions</a>
    <a class="h4" href="/explorer">Explorer</a>
    <a class="h4" href="/a-propos">À propos</a>
    <a class="h4" href="/participer">Participer</a>
    <a class="h4" href="/soutenir">Soutenir ce projet</a>

    <a class="h4" href="/">Se connecter</a>
    <a class="h4" href="/">Profil</a>

    <a class="h4" href="/">En</a>
  </nav>
  {/if}

  <span class="padded">
    <button on:click|stopPropagation={() => visible = !visible}>
      {#if !visible}
      <svg width="45" height="24" viewBox="0 0 45 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="45" height="24" rx="12" fill="var(--color)"/>
      <line x1="10.3848" y1="8" x2="35.3078" y2="8" stroke="white" stroke-width="2"/>
      <line x1="10.3848" y1="14.8462" x2="35.3078" y2="14.8462" stroke="white" stroke-width="2"/>
      </svg>
      {:else}
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="15" fill="var(--color)"/>
      <path d="M24.0005 7.72412L7.72461 24" stroke="white" stroke-width="2" stroke-linecap="square"/>
      <path d="M7.72414 7.72412L24 24" stroke="white" stroke-width="2" stroke-linecap="square"/>
      </svg>
      {/if}
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
      height: 100vh;
      background:  linear-gradient(180deg, rgba(251, 251, 251, 0.81) 71.35%, rgba(251, 251, 251, 0) 100%);
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

    button {
      border: none;
      padding: 0;
      background: none;
      border-radius: 0;
    }
  }
</style>