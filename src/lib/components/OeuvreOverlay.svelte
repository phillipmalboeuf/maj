<script lang="ts">
  import type { SoumissionDocument } from '../../routes/forms/[form_id]/soumissions/[id].svelte'
  import { fly, fade } from 'svelte/transition'
  import { page } from '$app/stores'

  import Overlay from './Overlay.svelte'
  import Picture from './Picture.svelte'
  import Document from './document/Document.svelte'
  import Comments from './Comments.svelte'

  export let open: string
  export let oeuvre: SoumissionDocument
</script>

<Overlay bind:open={open}>
  <article class="padded" transition:fly={{ y: 100 }}>
    <button transition:fade on:click={() => open = undefined}>Fermer</button>

    <h1 class="">{oeuvre.titre}</h1>

    <p>
      {#if oeuvre.nom}{oeuvre.nom}<br>{/if}
      {#if oeuvre.ville}{oeuvre.ville}<br>{/if}
      {#if oeuvre.date}{oeuvre.date}<br>{:else}Non datée<br>{/if}
    </p>
    <div>
      {#if oeuvre.description}
      <Document body={oeuvre.description} />
      {:else}
      <p>{oeuvre.bref}</p>
      {/if}
    </div>
    <figure>
      <Picture media={oeuvre.media} zoom maxHeight noDescription controls />
    </figure>

    <Comments url={`${$page.url.protocol}//${$page.url.host}/oeuvres/${oeuvre.id}`} />
  </article>
</Overlay>

<style lang="scss">
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
  }
</style>