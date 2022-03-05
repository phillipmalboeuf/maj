<script lang="ts">
  import { query } from '$lib/clients/contentful'

  import { onMount } from 'svelte'
  import { fade, fly } from 'svelte/transition'
  import Document from './document/Document.svelte'

  let open = false
</script>

<button class="fixed" on:click={() => open = !open}>Q/R</button>

{#if open}
<aside>
  <button transition:fade on:click={() => open = false} area-label="Close" />
  <ol>
    <li transition:fly={{ y: 10 }}>Quelle est votre question aujourd’hui?</li>
  {#await query(fetch, `query {
    questionCollection(order: [date_DESC]) {
      items {
        question
        date
        response {
          json
        }
      }
    }
  }`) then { data }}
    {#each data.questionCollection.items as question, i}
    <li transition:fly={{ y: 10, delay: 100*i }}>
      <p>Q.<br>{question.question}</p>
      R.<br>
      <Document body={question.response} />
    </li>
    {/each}
  {/await}
  </ol>
</aside>
{/if}

<style lang="scss">
  button.fixed {
    position: sticky;
    bottom: var(--gutter);
    left: var(--gutter);
    color: var(--light);
    background-color: var(--bleu);
    border-color: transparent;
    border-bottom-right-radius: 0;
    z-index: 16;
  }

  aside {
    position: fixed;
    inset: 0;
    z-index: 15;
    padding-top: 10rem;
    overflow-y: auto;
    
    > button {
      position: fixed;
      inset: 0;
      z-index: -1;
      // background: transparent;
      // border: none;
      background-color: rgba(251, 251, 251, 0.66);
      // -webkit-backdrop-filter: blur(4px);
      // backdrop-filter: blur(4px);

      border: none;
      border-radius: 0;

      // cursor: url(/close.png) 0 0, pointer;
    }

    ol {
      list-style: none;
      padding: var(--gutter);
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
          color: var(--dark);
          background: rgba(182, 206, 242, 0.9);
        }

        :global(p:last-child) {
          margin-bottom: 0;
        }
      }
    }
  }
</style>