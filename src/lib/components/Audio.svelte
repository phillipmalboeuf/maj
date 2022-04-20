<script lang="ts">
  import { onMount } from 'svelte'
  import { Duration } from 'luxon'

  export let media: any
  export let controls: boolean = true
  export let duration: string = undefined

  let element: HTMLAudioElement

  function loaded() {
    duration =  Duration.fromMillis(element.duration*1000).toFormat('mm:ss')
  }

  onMount(() => {
    if (element) {
      element.addEventListener('loadedmetadata', loaded)

      return () => element.removeEventListener('loadedmetadata', loaded)
    }
  })
</script>

<style lang="scss">
 
</style>

{#if media}
<audio bind:this={element} {controls} src={media.url} />
{/if}