<script lang="ts">
  import { onMount } from 'svelte'
  import { page } from '$app/stores'

  export let url: string = undefined

  onMount(() => {
    // @ts-ignore
    window.disqus_config = function () {
      this.page.url = url || $page.url.toString()
      this.page.identifier = url || $page.url.toString()
    }

    var d = document, s = d.createElement('script');
    s.src = '//maj.disqus.com/embed.js';
    s.setAttribute('data-timestamp', new Date().toString());
    (d.head || d.body).appendChild(s);
  })
</script>

<section class="padded">
  <div id="disqus_thread"></div>
</section>

<style lang="scss">
  section {
    background-color: var(--color);
  }
  div {
    max-width: 66rem;
    margin: 0 auto;
  }
</style>