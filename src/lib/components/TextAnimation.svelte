<script>
import { beforeNavigate } from '$app/navigation';

  import { onMount } from 'svelte'
  import { fade, blur } from 'svelte/transition'

  export let mark
  let duration = 1000
  let current = 0
  let hide = false
  let words = mark.value.split(' / ')
  let outinterval
  let interval

  onMount(() => {
    if (words.length > 1) {
      interval = setInterval(() => {
        hide = true
        next()

        outinterval = setTimeout(() => {
          hide = false
        }, duration * 1)
      }, duration * 3)

      return () => {
        clearInterval(interval)
        clearTimeout(outinterval)
      }
    }
  })

  beforeNavigate(() => {
    duration = 0
  })

  function next() {
    if (current === words.length - 1) {
      current = 0
    } else {
      current = current + 1
    }
  }
</script>

<style lang="scss">
  span {
    text-decoration: none;
  }
</style>

{#if words.length > 1}<br>{/if}
{#each words as word, i}
{#if i === current && !hide}
<span in:blur={{ duration, amount: 20 }} out:blur={{ duration, amount: 20 }}>{word}</span>
{/if}
{/each}