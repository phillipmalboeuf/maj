<script context="module" lang="ts">
  export interface OeuvreDocument {
    titre: string
    id: string
    description?: object
    media?: object
  }
</script>

<script lang="ts">
  import Document from './document/Document.svelte'
  import Picture from './Picture.svelte'

  export let oeuvres: OeuvreDocument[]
</script>

<ul class="grid">
  {#each oeuvres as oeuvre}
  <li>
    <figure>
      <Picture media={oeuvre.media} />
    </figure>

    <aside>
      <h6>{oeuvre.titre}</h6>
      <Document body={oeuvre.description} />
    </aside>
  </li>
  {/each}
</ul>

<style lang="scss">
  ul {
    list-style: none;
    padding: 0;
  }

  aside {
    color: var(--dark);
  }
</style>