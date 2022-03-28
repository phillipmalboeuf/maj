<script context="module" lang="ts">
  import { query } from '$lib/clients/contentful'
  import { media } from './[page].svelte'

  /** @type {import('@sveltejs/kit').Load} */
  export async function load({ fetch, params }) {
    const { data } = await query(fetch, `
      query {
        index(id: "1AWDRdqrE2Jks9micYfzwG") {
          titre
          id
          description
          pagesCollection {
            items {
              ... on Page {
                titre
                id
                description
                couleur
                fonce
                intro {
                  json
                }
                liensCollection(limit: 5) {
                  items {
                    titre
                    lien
                    externe
                  }
                }
              }
            }
          }
        }
        articleCollection(order: [date_DESC], limit: 3) {
          items {
            titre
            titreCourt
            id
            date
            media ${media}
            personnesCollection(limit: 6) {
              items {
                nom
                id
                position
              }
            }
          }
        }
        expositionCollection {
          items {
            titre
            titreCourt
            id
            debut
            media ${media}
            curatorsCollection(limit: 6) {
              items {
                nom
                id
                position
              }
            }
          }
        }
      }
    `)
    if (data) {
      return {
        props: { 
          index: data.index,
          articles: data.articleCollection.items,
          expositions: data.expositionCollection.items
        }
      }
    }
  }
</script>

<script lang="ts">
  import { onMount } from 'svelte'
  import { page } from '$app/stores'

  import type { PageDocument } from '$lib/components/Page.svelte'
  import type { ArticleDocument } from './articles/index.svelte'
  import type { ExpositionDocument } from './expositions/[id].svelte'

  import Document from '$lib/components/document/Document.svelte'
  import Articles from '$lib/components/Articles.svelte'
  import Expositions from '$lib/components/Expositions.svelte'
  import Link from '$lib/components/Link.svelte'

	export let index: {
    titre: string
    id: string
    description: string
    pagesCollection: {
      items: PageDocument[]
    }
  }
  export let articles: ArticleDocument[]
  export let expositions: ExpositionDocument[]

  let elements: {[key: string]: HTMLElement} = {}

  onMount(() => {
    document.body.setAttribute('style', `--color: var(--${elements[index.pagesCollection.items[0].id].getAttribute('data-color')})`)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(node => {
          if (node.isIntersecting) {
            document.body.setAttribute('style', `--color: var(--${node.target.getAttribute('data-color')})`)
          }
        })
      },
      { threshold: 0, rootMargin: '-9% 0 -90%' }
    )

    Object.values(elements).forEach(element => observer.observe(element))

    return () => observer.disconnect()
  })
</script>

<p class="center padded" style="color: var(--{index.pagesCollection.items[0].couleur?.toLowerCase()});">{index.description}</p>

{#each index.pagesCollection.items as page}
<section bind:this={elements[page.id]} id={page.id} data-color={page.fonce ? 'light' : page.couleur ? page.couleur.toLowerCase() : undefined}
  class:dark={page.fonce}
  style={page.couleur && (page.fonce ? `background-color: var(--${page.couleur.toLowerCase()})` : `color: var(--${page.couleur.toLowerCase()})`)}
  class="padded">
  <aside class="sticky">
    <a href="/{page.id}" sveltekit:prefetch><h2 class="p3">{page.titre}</h2></a>
    {#if page.description}<p>{page.description}</p>{/if}
    {#if page.liensCollection}
    <nav>
      {#each page.liensCollection.items as lien}
      <Link {lien} button /><br />
      {/each}
    </nav>
    {/if}
  </aside>

  <div>
    <Document body={page.intro} />

    {#if page.id === 'articles'}
    <Articles {articles} />
    {:else if page.id === 'expositions'}
    <Expositions {expositions} />
    {/if}
  </div>
</section>
{/each}

<style lang="scss">
  p {
    max-width: 42rem;
    margin-left: auto;
    margin-right: auto;
  }

  section {
    min-height: 50vh;

    &.dark {
      color: var(--light);
    }

    .sticky {
      top: 10rem;
      width: 24rem;
      height: 30vh;
    }

    > div {
      margin-top: -30vh;
      margin-left: 24rem;
      padding-left: var(--gutter);

      > :global(p) {
        font-size: 2rem;
        font-weight: bold;

        > :global(strong) {
          font-size: 6rem;
        }
      }
    }

    nav {
      :global(a) {
        margin-bottom: 0.5rem;
      }
    }
  }
</style>