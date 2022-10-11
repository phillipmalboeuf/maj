<script lang="ts">
  
  import { onMount } from 'svelte'
  import { fade, fly } from 'svelte/transition'
  import Page, { type PageDocument } from '$lib/components/Page.svelte'
  import Picture from '$lib/components/Picture.svelte'
  import ExpoLinks from '$lib/components/ExpoLinks.svelte'
  import { date } from '$lib/formatters'
  import { titre } from '$lib/stores'
  import OeuvreOverlay from '$lib/components/OeuvreOverlay.svelte'
  import Slider from '$lib/components/Slider.svelte'
  import Overlay from '$lib/components/Overlay.svelte'
  import { browser } from '$app/environment'

  import type { PageData } from './$types'
  export let data: PageData
  const { page, expositions } = data
	// export let page: PageDocument
  // export let expositions: ExpositionDocument[]

  let elements: {[key: string]: HTMLElement} = {}
  let open: string
  let scrollY: number
  let innerHeight: number
  let innerWidth: number
  let swiping: boolean
  let openList: boolean

  $: {
    if (browser) {
      Object.values(elements).forEach(element => {
        if (element.offsetTop < scrollY + (innerHeight / 2)) {
          titre.set(element.getAttribute('data-titre'))
        }
      })
    }
  }
</script>

<svelte:window bind:scrollY bind:innerHeight bind:innerWidth />

<Page {page}>
  <h1 class="center h2 padded" slot="titre" on:click={() => openList = true}>{page.titre} <span class="button">+</span></h1>
</Page>

{#if openList}
<Overlay bind:open={openList}>
<nav>
  <div class="padded fixed flex flex--end">
    <button transition:fly={{ y: 10 }} on:click={() => openList = false}>Fermer</button>
  </div>
  <ol class="padded">
    {#each expositions as expo, i}
    <li class="sh" transition:fly={{ y: 10, delay: 10*i }}>
      <a href="/expositions/{expo.id}/oeuvres?type=mur" class="grid grid--thirds">
        <span>{expo.titreCourt}</span>
        <span>{expo.titre}</span>
      </a>
    </li>
    {/each}
  </ol>
</nav>
</Overlay>
{/if}

<section>
  {#each expositions as expo, i}
  <div class="flex flex--middle flex--spaced padded" bind:this={elements[i]} id={expo.id}
    data-titre={expo.titreCourt || expo.titre}>
    <h4>{expo.titre}</h4>
    <!-- <h3>{expo.titreCourt || expo.titre}</h3> -->
    <ExpoLinks {expo} type="folder" />
    <div></div>
  </div>
  <ol class="padded">
    {#if expo.oeuvresCollection.items?.length}
    <Slider particlesToShow={innerWidth < 888 ? 3 : 7} detach bind:swiping>
    {#each expo.oeuvresCollection.items.filter(oeuvre => oeuvre) as oeuvre, j}
    <li>
      <a href="/expositions/{expo.id}/oeuvres/{oeuvre.id}"
        on:click|preventDefault={() => { if (!swiping) { open = `${i}.${j}` } }}>
        {#if oeuvre.media}<figure>
          <Picture media={oeuvre.media} noDescription maxCrop small />
        </figure>{/if}
        <h6>{oeuvre.titre}</h6>
        <aside class="flex flex--spaced">
          <small>{oeuvre.nom}</small>
          <!-- <span>{date(oeuvre.date)}</span> -->
        </aside>
      </a>
    </li>
    {/each}
    </Slider>
    {/if}
  </ol>
  {/each}

  {#if open}
  {@const [e, o] = open.split('.')}
  <OeuvreOverlay bind:open={open} oeuvre={expositions[e].oeuvresCollection.items[o]} />
  {/if}
</section>


<style lang="scss">
  h1 {
    cursor: pointer;
    color: var(--color);

    .button {
      padding: 0.05em 0.33em;
    }
  }

  nav {
    color: var(--color);

    li {
      a {
        transition: padding-left 333ms;
        
        &:hover,
        &:focus {
          padding-left: 1em;
        }
      }
    }

    button {
      background-color: white;
    }
  }

  section {
    color: var(--color);

    > div {
      h4,
      > div {
        margin-bottom: 0;
        flex: 1
      }
    }

    @media (max-width: 888px) {
      > div {
        flex-direction: column;
      }
    }
  }
  
  ol {
    list-style: none;

    li {
      position: relative;
      text-align: left;
    }
  }

  figure {
    // width: 3rem;
    // min-height: 6rem;
    margin-bottom: 0;
  }

  a {
    > aside,
    > h6 {
      padding: 0 0.5rem;
    }

    > h6 {
      margin-bottom: 0;
    }

    > aside {
      margin-bottom: 0.5rem;
    }
  }
</style>