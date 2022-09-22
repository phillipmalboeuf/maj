<script lang="ts">
  import Document from './document/Document.svelte'
  import Picture from './Picture.svelte'

  export let entry: {
    titre: string
    titreInvisible: boolean
    pleinePage: boolean
    media: object
    corps: {
      json: object
    }
  }
  export let center = false
</script>
<article class:center class="padded{entry.media ? " grid grid--thirds" : ""}" class:media={entry.media} class:h1={entry.pleinePage} class:full={entry.pleinePage}>
  {#if entry.media}<figure class="span__2"><Picture media={entry.media} /></figure>{/if}
  <aside>
    {#if !entry.titreInvisible}<h2 class="d2">{entry.titre}</h2>{/if}
    <div><Document body={entry.corps} /></div>
  </aside>
</article>

<style lang="scss">
  article {

    &:not(.full):not(.media) {
      max-width: 42rem;
      margin: 0 auto;
    }

    &.media {

    }

    &.center {
      text-align: center;
    }
  }

  div,
  figure {
    color: var(--dark);

    .full & {
      max-width: none;
    }

    .full &,
    .media &,
    .center & {
      color: var(--color);
    }
  }

  h2 {
    // margin-top: 0;

    .full &,
    .media & {
      color: var(--color);
    }

    .media & {
      text-align: left;
    }
  }
</style>
