<script lang="ts">
  import Document from './document/Document.svelte'
  import Picture from './Picture.svelte'

  export let entry: {
    titre: string
    titreInvisible: boolean
    colonnes: number
    alignement: string
    mediasCollection: {
      items: object[]
    }
  }
</script>

{#if !entry.titreInvisible}<h2 class="d2 center">{entry.titre}</h2>{/if}
<div class="flex flex--wrap{entry.alignement === "Droite" ? ' flex--end' : ''}">
  {#if entry.mediasCollection}
  {#each entry.mediasCollection.items as media}
  <figure class={entry.colonnes && { 2: 'flex__half', 3: 'flex__third' }[entry.colonnes]}><Picture {media} zoom /></figure>
  {/each}
  {/if}
</div>

<style lang="scss">

  h2 {
    margin-top: calc(var(--gutter) * 2);
  }
</style>
