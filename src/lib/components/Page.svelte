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
    gallerie?: any
  }
</script>

<script lang="ts">
  import { onMount } from 'svelte'
  import Contenu from './Contenu.svelte'
  import { titre } from '$lib/stores'

	export let page: PageDocument
  export let noTitre = false

  if (!noTitre && page) { titre.set(page.titre) } else { titre.set(undefined) }
</script>

{@html `<style>body { --color: var(--${page?.couleur?.toLowerCase()}) !important; }</style>`}
{#if !noTitre}
{#if $$slots?.titre}
<slot name="titre" />
{:else}
<h1 class="center h2 padded">{page?.titre}</h1>
{/if}
<Contenu contenu={page?.contenuCollection?.items} />
{/if}

<style lang="scss">
  h1 {
    color: var(--color);
  }
</style>