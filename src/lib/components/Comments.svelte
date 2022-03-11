<script lang="ts">
import { onMount } from 'svelte';


  onMount(() => {
    var d = document, s = d.createElement('script');
    s.src = '//maj.disqus.com/embed.js';
    s.setAttribute('data-timestamp', new Date().toString());
    (d.head || d.body).appendChild(s);
  })
</script>

<div class="padded" id="disqus_thread"></div>

<style lang="scss">
  div {
    max-width: 66rem;
    margin: 0 auto;
  }
</style>