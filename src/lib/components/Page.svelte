<script context="module" lang="ts">
  import type { Lien } from './Link.svelte'
  
  export interface PageDocument {
    titre: string
    id: string
    couleur: string
    fonce: boolean
    description?: string
    media?: object
    intro?: {
      json: object
    }
    liensCollection?: {
      items: Lien[]
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
<h1 class="center h2 padded">{page.titre}</h1>
<Contenu contenu={page.contenuCollection?.items} />
{/if}

<style lang="scss">
  h1 {
    color: var(--color);
  }
</style>