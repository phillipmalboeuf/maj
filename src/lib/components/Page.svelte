<script context="module" lang="ts">
  export interface PageDocument {
    titre: string
    id: string
    couleur: string
    fonce: boolean
    description?: string
    intro?: {
      json: object
    }
    contenuCollection?: {
      items: any[]
    }
  }
</script>

<script lang="ts">
  import { onMount } from 'svelte'
  import Contenu from './Contenu.svelte'

	export let page: PageDocument
  export let noTitre = false
</script>

{@html `<style>body { --color: var(--${page.couleur?.toLowerCase()}) !important; }</style>`}
{#if !noTitre}
<h1 class="center">{page.titre}</h1>
<Contenu contenu={page.contenuCollection?.items} />
{/if}

<style lang="scss">
  h1 {
    color: var(--color);
  }
</style>