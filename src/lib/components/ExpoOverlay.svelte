<script lang="ts">
  import type { CuratorDocument, ExpositionDocument } from '../../routes/expositions/[id]/index.svelte'
  import { onMount } from 'svelte'
  import { DateTime } from 'luxon'
  import { fly, fade } from 'svelte/transition'
  import { query } from '$lib/clients/contentful'
  import { page } from '$app/stores'

  import Overlay from './Overlay.svelte'
  import Picture from './Picture.svelte'
  import Document from './document/Document.svelte'
  import Comments from './Comments.svelte'

  export let open: string | boolean
  export let onClose: Function = undefined
  
  export let exposition: ExpositionDocument
  // export let curators: CuratorDocument[]

  const d = exposition.debut && DateTime.fromISO(exposition.debut)
  const f = exposition.fin && DateTime.fromISO(exposition.fin)

  let readingTime: number
  let element: HTMLElement
  const wpm = 200

  $: {
    if (element) {
      readingTime = Math.ceil(element.innerText.trim().split(/\s+/).length / wpm)
    }
  }
</script>

<Overlay bind:open={open} {onClose}>
  <article transition:fly={{ y: 100 }} bind:this={element} class="padded">
    <button transition:fade on:click={() => open = undefined}>Fermer</button>

    <h2 class="center">{exposition.titreCourt}</h2>
    <br><br>

    <h1 class="d1 center">{exposition.titre}</h1>

    <div class="flex flex--middle flex--center padded">
      {#if d}<span>{d?.toFormat('yyyy.mm.dd')} {f ? f.toFormat('yyyy.mm.dd') : ''}</span>{/if}
      {#await query(fetch, `
        query($id: String!) {
          expositionCollection(limit: 1, where: {id: $id}) {
            items {
              id
              curatorsCollection {
                items {
                  nom
                  id
                  position
                }
              }
            }
          }
        }
      `, {
        id: exposition.id
      })}
        <span>...</span>
      {:then { data }}
      <span>{data.expositionCollection.items[0].curatorsCollection.items.map(curator => [curator.nom, curator.position].join(', ')).join(', ')}</span>
      {/await}
      <span>{readingTime} min</span>
      <!-- <div><ExpoLinks expo={exposition} noDescription /></div> -->
    </div>

    <div class="description">
      <Document body={exposition.description} />
    </div>
    <!-- <Oeuvres {exposition} {oeuvres} /> -->

    <Comments url={`${$page.url.protocol}//${$page.url.host}/expositions/${exposition.id}`} />
  </article>
</Overlay>

<style lang="scss">
  article {
    color: var(--color);

    .description {
      padding-top: 4rem;
      padding-bottom: 4rem;
    }
  }

  article {
    position: relative;
    max-width: 911px;
    margin: var(--gutter) auto;
    background-color: var(--light);
    border-radius: 1.5rem;
    padding: calc(var(--gutter) / 2);

    > button {
      position: absolute;
      top: calc(var(--gutter) / 2);
      right: calc(var(--gutter) / 2);
    }

    @media (max-width: 888px) {
      .flex {
        flex-direction: column;
      }
    }
  }

  span {
    border: 1px solid;
    padding: 0.15em 0.5em;
    line-height: 1;
  }
</style>