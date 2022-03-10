<script lang="ts">
  import { fade, fly } from 'svelte/transition'
  import type { FormDocument } from '../../routes/forms/[id].svelte'

  export let form: FormDocument
  export let emphasis = false
</script>

<fieldset>
{#each form.inputsCollection.items.filter(item => emphasis ? item.emphasis : !item.emphasis) as input, i}
  <div in:fly={{ y: 10, delay: 100*i }}>
  {#if input.type === 'Textarea'}
  <label for={input.id}>{input.label}</label>
  <textarea id={input.id} name={input.id} />
  {:else if input.type === 'Email'}
  <label for={input.id}>{input.label}</label>
  <input type="email" id={input.id} name={input.id} />
  {:else if input.type === 'Date'}
  <label for={input.id}>{input.label}</label>
  <input type="text" id={input.id} name={input.id} />
  {:else if input.type === 'File'}
  <label class="file" for={input.id}>{input.label}</label>
  <input type="file" id={input.id} name={input.id} />
  {:else}
  <label for={input.id}>{input.label}</label>
  <input id={input.id} name={input.id} />
  {/if}
  </div>
{/each}
</fieldset>

<style lang="scss">
  fieldset {
    border: none;
    padding: 0;
  }

    label {
      display: block;
      // color: var(--light);
      margin: 0 0 0 1em;
      width: 75%;
    }

    input,
    textarea {
      display: block;
      border: none;

      font-size: 1rem;
      line-height: 1;
      color: var(--light);
      background: var(--color);
      border-radius: 1.5em;
      padding: 0.66em 1em;
      margin-bottom: 1em;

      width: 88%;
      
      &:focus {
        outline: none;
      }
    }

    input[type="file"] {
      cursor: pointer;
      padding-top: 12em;
    }

    textarea {
      width: 100%;
      height: 12em;
    }
</style>