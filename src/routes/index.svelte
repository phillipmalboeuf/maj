<script context="module" lang="ts">
  import { query } from '$lib/clients/contentful'

  /** @type {import('@sveltejs/kit').Load} */
  export async function load({ fetch, params }) {
    const { data } = await query(fetch, `
      query {
        index(id: "1AWDRdqrE2Jks9micYfzwG") {
          titre
          id
          pagesCollection {
            items {
              ... on Page {
                titre
                id
                description
                couleur
              }
            }
          }
        }
      }
    `)
    if (data) {
      return {
        props: { 
          index: data.index
        }
      }
    }
  }
</script>

<script lang="ts">
  import { onMount } from 'svelte'

	export let index: {
    titre: string
    id: string
    pagesCollection: {
      items: {
        titre: string
        id: string
        description: string
        couleur: string
      }[]
    }
  }

  let elements: {[key: string]: HTMLElement} = {}

  onMount(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(node => {
          if (node.isIntersecting) {
            document.body.setAttribute('style', `--color: var(--${node.target.getAttribute('data-color')})`)
          }
        })
      },
      { threshold: 1 }
    )

    Object.values(elements).forEach(element => observer.observe(element))

    return () => observer.disconnect()
  })
</script>

{#each index.pagesCollection.items as page}
<section bind:this={elements[page.id]} id={page.id}
  data-color={page.couleur?.toLowerCase()}
  style="color: var(--{page.couleur?.toLowerCase()});"
  class="padded">
  <aside class="sticky">
    <h2 class="p3">{page.titre}</h2>
    <p>{page.description}</p>
  </aside>
</section>
{/each}

<style lang="scss">
  section {
    min-height: 88vh;

    .sticky {
      top: 10rem;
      width: 24rem;
    }
  }
</style>