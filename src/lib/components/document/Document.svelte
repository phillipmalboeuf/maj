<script lang="ts">
  import { setContext } from 'svelte'
  import Node from './Node.svelte'

  export let body
  export let animation = undefined

  setContext('animation', animation)
</script>

{#if body}
{#each body.json.content as node}
<Node node={node} />
{/each}
{/if}