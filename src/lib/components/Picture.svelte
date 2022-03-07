<script>
  export let media
  export let small = false
  export let noDescription = false
  export let ar = undefined
  export let eager = false
</script>

<style>
  img,
  video {
    width: 100%;
    max-width: 100%;
  }
</style>

{#if media.title !== '[SPACER]'}
{#if media.contentType.startsWith('video/')}
<video src="{media.url}" autoplay muted loop playsinline />
{:else}
<picture>
  {#if small}
<source srcSet="{media.url}?w=400{ar ? `&h=${Math.round(ar * 400)}&fit=fill` : ''}&fm=avif" type="image/avif" media="(max-width: 900px)" />
<source srcSet="{media.url}?w=400{ar ? `&h=${Math.round(ar * 400)}&fit=fill` : ''}" media="(max-width: 900px)" />
<source srcSet="{media.url}?w=600{ar ? `&h=${Math.round(ar * 600)}&fit=fill` : ''}&fm=avif" type="image/avif" media="(max-width: 1200px)" />
<source srcSet="{media.url}?w=600{ar ? `&h=${Math.round(ar * 600)}&fit=fill` : ''}" media="(max-width: 1200px)" />
<source srcSet="{media.url}?w=800{ar ? `&h=${Math.round(ar * 800)}&fit=fill` : ''}&fm=avif" type="image/avif" />
<img style={ar ? `aspect-ratio: 800 / ${Math.round(ar * 800)}` : `aspect-ratio: ${media.width} / ${media.height}`} src="{media.url}?w=800{ar ? `&h=${Math.round(ar * 800)}&fit=fill` : ''}" alt="{media.title} {media.description}" loading={eager ? "eager" : "lazy"} />
  {:else}
<source srcSet="{media.url}?w=900{ar ? `&h=${Math.round(ar * 900)}&fit=fill` : ''}&fm=avif" type="image/avif" media="(max-width: 900px)" />
<source srcSet="{media.url}?w=900{ar ? `&h=${Math.round(ar * 900)}&fit=fill` : ''}" media="(max-width: 900px)" />
<source srcSet="{media.url}?w=1200{ar ? `&h=${Math.round(ar * 1200)}&fit=fill` : ''}&fm=avif" type="image/avif" media="(max-width: 1200px)" />
<source srcSet="{media.url}?w=1800{ar ? `&h=${Math.round(ar * 1800)}&fit=fill` : ''}&fm=avif" type="image/avif" />
<img style={ar ? `aspect-ratio: 1800 / ${Math.round(ar * 1800)}` : `aspect-ratio: ${media.width} / ${media.height}`} src="{media.url}?w=1800{ar ? `&h=${Math.round(ar * 1800)}&fit=fill` : ''}" alt="{media.title} {media.description}" loading={eager ? "eager" : "lazy"} />
  {/if}
</picture>
{/if}

{#if !noDescription && (media.title || media.description)}
<p class="small">{media.title} {media.description}</p>
{/if}
{/if}