<script lang="ts">
  import Document from './document/Document.svelte'
  import Picture from './Picture.svelte'

  export let entry: {
    titre: string
    titreInvisible: boolean
    mediasCollection: {
      items: object[]
    }
  }
</script>

{#if !entry.titreInvisible}<h2 class="d2 center">{entry.titre}</h2>{/if}
<div class="flex">
  {#if entry.mediasCollection}
  {#each entry.mediasCollection.items as media}
  <figure><Picture {media} zoom /></figure>
  {/each}
  {/if}
</div>

<style lang="scss">
  figure {
    flex: 1;
  }

  h2 {
    margin-top: calc(var(--gutter) * 2);
  }
</style>
