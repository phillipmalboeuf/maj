<script lang="ts">
  import { fade, fly } from 'svelte/transition'
  import type { FormDocument } from '../../routes/forms/[id].svelte'
import TextareaAuto from './TextareaAuto.svelte'

  export let form: FormDocument
  export let emphasis = false
</script>

<fieldset>
{#each form.inputsCollection.items.filter(item => emphasis ? item.emphasis : !item.emphasis) as input, i}
  <div in:fly={{ y: 10, delay: 100*i }}>
  {#if input.label}<label class={input.type} for={input.id}>{input.label}</label>{/if}
  {#if input.type === 'Textarea'}
  <textarea id={input.id} placeholder={input.placeholder} name={input.id} />
  {:else if input.type === 'Email'}
  <input type="email" id={input.id} placeholder={input.placeholder} name={input.id} />
  {:else if input.type === 'Date'}
  <input type="text" id={input.id} placeholder={input.placeholder} name={input.id} />
  {:else if input.type === 'File'}
  <input type="file" id={input.id} placeholder={input.placeholder} name={input.id} />
  {:else}
  {#if input.id === 'question'}
  <TextareaAuto minRows={1} maxRows={6} id={input.id} placeholder={input.placeholder} name={input.id} />
  {:else}
  <input id={input.id} placeholder={input.placeholder} name={input.id} />
  {/if}
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
      margin: 0 0 0.33em;
      width: 75%;
    }

    input,
    textarea,
    :global(textarea),
    :global(pre) {
      display: block;
      border: none;

      font-size: 1rem;
      line-height: 1;
      color: var(--light);
      background: var(--light-grey);
      border-radius: 1.5em;
      padding: 0.66em 1em;
      margin-bottom: 1em;

      width: 88%;

      // &:not(:placeholder-shown) {
      //   background: var(--grey);
      // }
      
      &:focus {
        outline: none;
        background: var(--grey);
      }

      &::placeholder {
        color: var(--light);
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