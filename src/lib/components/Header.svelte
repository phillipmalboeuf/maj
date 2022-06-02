<script lang="ts">
  import { query } from '$lib/clients/contentful'
  import { titre } from '$lib/stores'

  import { fade, fly } from 'svelte/transition'
  import Link from './Link.svelte'
  import Logo from './Logo.svelte'
  import NewsletterForm from './NewsletterForm.svelte'

  let visible = false
  let scrollY: number = 0
</script>

<svelte:body on:click={() => visible = false} />
<svelte:window bind:scrollY />

<header class:visible class:scrolled={scrollY > 0} id="header">
  <span class="padded logo">
    <a href="/#top" aria-label="Accueil">
      <Logo />
    </a>
  </span>

  {#await query(fetch, `
    query {
      navigationCollection(limit: 2, order: sys_publishedAt_ASC) {
        items {
          titre
          liensCollection {
            items {
              titre
              lien
              externe
            }
          }
        }
      }
    }
  `) then { data } }
  {#if visible}
  <nav class="padded" transition:fly={{ y: -100 }}>
    {#each data.navigationCollection.items[0].liensCollection.items as lien, i}
    {#if i === data.navigationCollection.items[0].liensCollection.items.length - 1}<br>{/if}
    <h3><Link {lien} /></h3>
    {/each}
    
    <br>
    <a class="h3" href="/">En</a>

    <div on:click|stopPropagation><NewsletterForm /></div>

    <div class="flex flex--thick">  
      {#each data.navigationCollection.items[1].liensCollection.items as lien, i}
      <Link {lien} />
      {/each}
    </div>
  </nav>
  {/if}
  {/await}

  {#if scrollY > 0 && $titre}
  <span class="titre padded" transition:fade={{ duration: 333 }}>
    <h2>{$titre}</h2>
  </span>
  {/if}
  

  <span class:visible class="padded">
    <button on:click|stopPropagation={e => {
      e.currentTarget.blur()
      visible = !visible
    }}>
      {#if !visible}
      <svg width="45" height="24" viewBox="0 0 45 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="10.3848" y1="8" x2="35.3078" y2="8" stroke="white" stroke-width="2"/>
      <line x1="10.3848" y1="14.8462" x2="35.3078" y2="14.8462" stroke="white" stroke-width="2"/>
      </svg>
      {:else}
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M24.0005 7.72412L7.72461 24" stroke="white" stroke-width="2" stroke-linecap="square"/>
      <path d="M7.72414 7.72412L24 24" stroke="white" stroke-width="2" stroke-linecap="square"/>
      </svg>
      {/if}
    </button>
  </span>
</header>

<style lang="scss">
  header {
    position: fixed;
    z-index: 10;
    top: 0;
    left: 0;
    width: 100vw;
    color: var(--color);
    background: transparent;
    transition: background-color 333ms;

    :global(svg) {
      transition: height 333ms, width 333ms;
    }

    &.scrolled {

      &:before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: var(--huge);
        background:  linear-gradient(180deg, rgba(251, 251, 251, 0.81) 71.35%, rgba(251, 251, 251, 0) 100%);
        -webkit-backdrop-filter: blur(20px);
        backdrop-filter: blur(20px);
        filter: blur(4px);  
      }
      

      @media (min-width: 888px) {
      > span {
        padding-top: calc(var(--gutter) / 2);
      }

      .logo :global(svg) {
        width: 120px;
        height: 42px;
      }
      }

      @media (max-width: 888px) {
      &:before {
        height: calc(var(--huge) * 0.88);
      }

      .logo :global(svg) {
        width: 66px;
        height: 30px;
      }
      }
    }

    nav,
    > span {
      position: fixed;
      z-index: 10;
      top: 0;
      left: 0;
      transition: padding-top 333ms;
    }

    nav {
      z-index: 9;
      width: 100vw;
      height: 100vh;
      background:  linear-gradient(180deg, rgba(251, 251, 251, 0.81) 71.35%, rgba(251, 251, 251, 0) 100%);
      -webkit-backdrop-filter: blur(20px);
      backdrop-filter: blur(20px);
      padding-top: var(--gutter);
      padding-left: 24rem;

      @media (max-width: 888px) {
        padding-top: calc(var(--gutter) * 8);
        padding-left: var(--gutter);
      }

      > :global(a),
      > h3 :global(a) {
        display: block;
        margin-bottom: 0.33em;
        text-decoration: none;
        transition: padding-left 333ms;
        
        &:hover,
        &:focus {
          padding-left: 1em;
        }
      }

      > div {
        position: fixed;
        bottom: 30%;
        left: 24rem;

        @media (max-width: 888px) {
          padding-top: calc(var(--gutter) * 3);
          position: static;
        }
      }

      > div:first-of-type {
        left: var(--gutter);
      }
    }

    > .titre {
      z-index: 8;
      right: 0;
      width: 100%;
      text-align: center;
    }

    > span:last-child {
      left: auto;
      right: 0;

      &.visible {
        top: -0.25rem;
        right: 0.25rem;
        
        button {
          padding: 0.15rem 0.13rem 0.15rem 0.15rem;
        }
      }
    }

    button {
      border: none;
      padding: 0;
      background: var(--color);
      transition: color 333ms, background-color 333ms, border-radius 666ms;
    }
  }

  :global(body.dark) header {
    // color: var(--color);

    // &:not(.visible) > span > a {
    //   color: var(--light);
    // }

    // button {
    //   background: var(--light);

    //   line,
    //   path {
    //     stroke: var(--color);
    //   }
    // }
  }
</style>