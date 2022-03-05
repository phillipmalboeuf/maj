<script lang="ts">
  import Document from './document/Document.svelte'

  export let entry: {
    titre: string
    titreInvisible: boolean
    corps: {
      json: object
    }
  }
</script>

<h2 class="d2 center">{entry.titre}</h2>
<div><Document body={entry.corps} /></div>

<style lang="scss">
  div {
    max-width: 42rem;
    margin: 0 auto var(--gutter);
    color: var(--dark);
  }

  h2 {
    margin-top: calc(var(--gutter) * 2);
  }
</style>
