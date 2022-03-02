<script lang="ts">
  import { onMount } from 'svelte'
  import type { PageDocument } from '$routes/[page].svelte'

	export let page: PageDocument
  export let noTitre = false
</script>

{@html `<style>body { --color: var(--${page.couleur?.toLowerCase()}) !important; }</style>`}
{#if !noTitre}
<h1 class="center">{page.titre}</h1>
{/if}

<style lang="scss">
  h1 {
    color: var(--color);
  }
</style>