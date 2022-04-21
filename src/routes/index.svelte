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
                gallerie {
                  titre
                  titreInvisible
                  colonnes
                  alignement
                  mediasCollection(limit: 8) {
                    items ${media}
                  }
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
        articleCollection(order: [date_DESC], limit: 1) {
          items {
            __typename
            titre
            titreCourt
            vedette
            id
            date
            media ${media}
            personnesCollection(limit: 2) {
              items {
                nom
                id
                position
              }
            }
          }
        }
        activityCollection(order: [date_DESC], limit: 1) {
          items {
            __typename
            titre
            titreCourt
            id
            date
            media ${media}
            personnesCollection(limit: 2) {
              items {
                nom
                id
                position
              }
            }
          }
        }
        baladoCollection(order: [date_DESC], limit: 1) {
          items {
            __typename
            titre
            titreCourt
            id
            date
            media ${media}
            personnesCollection(limit: 2) {
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
            __typename
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
          balados: data.baladoCollection.items,
          activites: data.activityCollection.items,
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
  import type { ActivityDocument } from './activites/index.svelte'
  import type { BaladoDocument } from './balados/index.svelte'
import Gallerie from '$lib/components/Gallerie.svelte'

	export let index: {
    titre: string
    id: string
    description: string
    pagesCollection: {
      items: PageDocument[]
    }
  }
  export let articles: ArticleDocument[]
  export let balados: BaladoDocument[]
  export let activites: ActivityDocument[]
  export let expositions: ExpositionDocument[]

  let elements: {[key: string]: HTMLElement} = {}

  onMount(() => {
    document.body.setAttribute('style', `--color: var(--${elements[index.pagesCollection.items[0].id].getAttribute('data-color')}); color: var(--color);`)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(node => {
          if (node.isIntersecting) {
            const color = node.target.getAttribute('data-color')
            const background = node.target.getAttribute('data-background-color')

            if (background) {
              document.body.classList.add('dark')
              document.body.setAttribute('style', `--color: var(--${color}); background-color: var(--${background}); color: var(--light);`)
            } else {
              document.body.classList.remove('dark')
              document.body.setAttribute('style', `--color: var(--${color}); color: var(--color);`)
            }
          }
        })
      },
      { threshold: 0, rootMargin: '-40% 0% -40%' }
    )

    Object.values(elements).forEach(element => observer.observe(element))

    return () => observer.disconnect()
  })
</script>

<p class="center padded">{index.description}</p>

{#each index.pagesCollection.items as page, i}
<section bind:this={elements[page.id]} id={page.id}
  data-color={page.couleur ? page.couleur.toLowerCase() : 'dark'}
  data-background-color={page.fonce ? page.couleur ? page.couleur.toLowerCase() : 'dark' : undefined}
  class="padded">
  <aside class="sticky">
    <div>
      <h2 class="p3"><a href="/{page.id}" class="button" sveltekit:prefetch>{page.titre} <svg width="53" height="32" viewBox="0 0 53 32" fill="none" xmlns="http://www.w3.org/2000/svg"> <line x1="15.623" y1="15.8079" x2="-0.000949809" y2="15.8079" stroke="white" stroke-width="1.15"/> <path d="M38.023 31.616L52.9991 15.808L38.023 0H36.423L50.823 15.232H15.623V16.384H50.823L36.423 31.616H38.023Z" fill="white"/> </svg> </a></h2>
      {#if page.description}<p>{page.description}</p>{/if}
      {#if page.liensCollection}
      <nav>
        {#each page.liensCollection.items as lien}
        <Link button {lien} /><br />
        {/each}
      </nav>
      {/if}
    </div>

    <nav class="jumps">
      {#each index.pagesCollection.items as _page, _i}
      {#if page.id !== _page.id}
      <a href="#{_page.id}">{_page.titre} {#if _i > i}↓{:else}↑{/if}</a>
      {/if}
      {/each}
    </nav>
  </aside>

  <div>
    <Document body={page.intro} />
    {#if page.gallerie}
    <Gallerie entry={page.gallerie} />
    {/if}

    {#if page.id === 'explorer'}
    <Articles articles={[...articles,...activites,...balados]} />
    {:else if page.id === 'expositions'}
    <Expositions {expositions} />
    {/if}
  </div>

  
</section>
{/each}

<style lang="scss">
  $height: calc(100vh - 18rem);

  p {
    width: 100%;
    max-width: 42rem;
    margin-left: auto;
    margin-right: auto;

    &.center {
    @media (max-width: 888px) {
      display: none;
    }
    }
  }

  section {
    min-height: 100vh;

    .sticky {
      top: 10rem;
      width: 24rem;
      height: $height;

      display: flex;
      flex-direction: column;
      justify-content: space-between;
      
      .jumps {
        display: flex;
        justify-content: space-between;
      }

      @media (max-width: 888px) {
        position: relative;
        top: 0;
        height: auto;
      }
    }

    > div {
      margin-top: calc($height * -1);
      margin-left: 24rem;
      padding-left: var(--gutter);

      @media (max-width: 888px) {
        margin: 0;
        padding-left: 0;
      }

      > :global(p) {
        font-size: 2rem;
        font-weight: bold;

        > :global(strong) {
          font-size: 6rem;

          @media (max-width: 888px) {
            font-size: 4rem;
          }
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