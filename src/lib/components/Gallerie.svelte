<script lang="ts">
  import { onMount } from 'svelte'

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

  
  let length = entry.mediasCollection.items.length
  let order = [...new Array(length)].map((_, i) => i)
  const blur = entry.alignement === "Blur"

  onMount(() => {
    if (blur) {
      const interval = setInterval(() => {
        // current = current === length - 1 ? 0 : current + 1
        order.unshift(order.pop())
        order = [...order]
      }, 2666)

      return () => clearInterval(interval)
    }
  })
</script>

{#if !entry.titreInvisible}<h2 class="d2 center">{entry.titre}</h2>{/if}
<div class:blur class="flex flex--wrap{entry.alignement === "Droite" ? ' flex--end' : ''}{entry.alignement === "Blur" ? ' flex--nogap' : ''}">
  {#if entry.mediasCollection}
  {#each entry.mediasCollection.items as media, i}
  {#if blur}
  <figure style="top: {order[i] * (200/length)}px; left: {(order[i] * (66/length))+(66/length)}%; z-index: {length - order[i]}" class:current={order[i] === 0} class={entry.colonnes && { 2: 'flex__half', 3: 'flex__third', 4: 'flex__fourth' }[entry.colonnes]}><Picture {media} noDescription /></figure>
  {:else}
  <figure class={entry.colonnes && { 2: 'flex__half', 3: 'flex__third', 4: 'flex__fourth' }[entry.colonnes]}><Picture {media} zoom /></figure>
  {/if}
  {/each}
  {/if}
</div>

<style lang="scss">
  h2 {
    margin-top: calc(var(--gutter) * 2);
  }

  .blur {
    position: relative;

    @media (max-width: 888px) {
      padding-bottom: 20rem;
    }
  }

  figure {
    margin-bottom: 0;
    overflow: visible;

    .blur & {
      position: absolute;
      transform: translate3d(0,0,0);
      transition: filter 666ms, top 666ms, left 666ms;

      &:not(.current) {
        filter: blur(20px);
      }
    }
  }
</style>
