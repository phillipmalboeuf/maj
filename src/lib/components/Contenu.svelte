<script lang="ts">
  import Gallerie from './Gallerie.svelte'
  import Slider from './Slider.svelte'
  import Text from './Text.svelte'

  export let contenu: any[]
</script>

{#if contenu}
{#each contenu as entry}
{#if entry.__typename === 'Text'}
<Text {entry} />
{:else if entry.__typename === 'Gallerie'}
<Gallerie {entry} />
{:else if entry.__typename === 'Slider'}
{#if !entry.titreInvisible}<h2 class="d2 center">{entry.titre}</h2>{/if}
<Slider particlesToShow={1}>
  {#each entry.slidesCollection.items as slide}
  <Text entry={slide} center />
  {/each}
</Slider>
{/if}
<br>
{/each}
{/if}