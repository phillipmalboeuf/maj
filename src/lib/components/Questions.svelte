<script lang="ts">
  import { query } from '$lib/clients/contentful'

  import { onMount } from 'svelte'
  import { fade, fly } from 'svelte/transition'
  import Document from './document/Document.svelte'
  import Inputs from './Inputs.svelte'
  import Overlay from './Overlay.svelte'

  let open = false
</script>

<button class="fixed" on:click={() => open = !open}>Q/R</button>

<Overlay bind:open={open}>
  <ol>
    
  {#await query(fetch, `query($id: String!) {
    formCollection(limit: 1, where: {id: $id}) {
      items {
        titre
        id
        cta
        inputsCollection {
          items {
            label
            placeholder
            id
            type
            emphasis
          }
        }
      }
    }
    questionCollection(order: [date_DESC]) {
      items {
        question
        date
        response {
          json
        }
      }
    }
  }`, { id: 'question' }) then { data }}
    <li transition:fly={{ y: 10 }}>
      <p>{data.formCollection.items[0].titre}</p>
      <hr>
      <form class="flex flex--middle" action="/question" method="post">
        <Inputs form={data.formCollection.items[0]} />
        <button>{data.formCollection.items[0].cta}</button>
      </form>
    </li>
    {#each data.questionCollection.items as question, i}
    <li transition:fly={{ y: 10, delay: 100*i }}>
      <p>Q.<br>{question.question}</p>
      R.<br>
      <Document body={question.response} />
    </li>
    {/each}
  {/await}
  </ol>
</Overlay>

<style lang="scss">
  button.fixed {
    position: sticky;
    bottom: var(--gutter);
    left: var(--gutter);
    color: var(--light);
    background-color: var(--bleu);
    border-color: transparent;
    border-bottom-right-radius: 0;
    z-index: 14;
    margin-top: var(--gutter);
  }

  ol {
    list-style: none;
    padding: var(--gutter);
    padding-top: 10rem;
    max-width: calc(24rem + var(--gutter));
    margin: 0 auto;

    li {
      color: var(--light);
      background: var(--bleu);
      margin-bottom: 1em;
      padding: calc(var(--gutter) / 2);
      border-radius: 2em;
      -webkit-backdrop-filter: blur(4px);
      backdrop-filter: blur(4px);

      &:first-child {
        // color: var(--dark);
        background: rgba(141, 178, 234, 0.9);
      }

      hr {
        border: none;
        height: 1px;
        background-color: currentColor;
        margin: calc(var(--gutter) / 2) calc(var(--gutter) * -0.5);
      }

      :global(p:last-child) {
        margin-bottom: 0;
      }
    }
  }
</style>