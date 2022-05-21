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
<Slider {entry} autoplay />
{/if}
<br>
{/each}
{/if}