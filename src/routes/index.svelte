<script context="module" lang="ts">
  import { query } from '$lib/clients/contentful'
  import { contenuCollection, media } from '$lib/nodes'

  import type { Load } from '@sveltejs/kit'
  export const load: Load = async ({ fetch, params }) => {
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
        expositionCollection(order: [debut_DESC], limit: 10) {
          items {
            __typename
            titre
            titreCourt
            id
            debut
            media ${media}
            oeuvresCollection(limit: 1) {
              items {
                ... on Oeuvre {
                  titre
                  media ${media}
                }
                ... on Soumission {
                  titre
                  media ${media}
                }
              }
            }
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
  import { browser } from '$app/env'

  import type { PageDocument } from '$lib/components/Page.svelte'
  import type { ArticleDocument } from './articles/index.svelte'
  import type { ExpositionDocument } from './expositions/[id]/index.svelte'
  import type { ActivityDocument } from './activites/index.svelte'
  import type { BaladoDocument } from './balados/index.svelte'

  import Document from '$lib/components/document/Document.svelte'
  import Articles from '$lib/components/Articles.svelte'
  import Expositions from '$lib/components/Expositions.svelte'
  import Link from '$lib/components/Link.svelte'
  import Gallerie from '$lib/components/Gallerie.svelte'
  import TextAnimation from '$lib/components/TextAnimation.svelte'
  import { titre } from '$lib/stores'
  import { page } from '$app/stores'
    import Fleche from '$lib/components/Fleche.svelte';

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
  let scrollY: number
  let innerHeight: number

  onMount(() => {
    document.body.setAttribute('style', `--color: var(--${elements[index.pagesCollection.items[0].id].getAttribute('data-color')}); color: var(--color);`)

    return () => {
      document.body.classList.remove('dark')
      document.body.removeAttribute('style')
    }
  })

  $: {
    if (browser) {
      Object.values(elements).forEach(element => {
        if (element.offsetTop < scrollY + (innerHeight / 2)) {
          const color = element.getAttribute('data-color')
          const background = element.getAttribute('data-background-color')
          titre.set(element.getAttribute('data-titre'))

          if (background) {
            document.body.classList.add('dark')
            document.body.setAttribute('style', `--color: var(--${color}); --faded-color: var(--${color}-faded); background-color: var(--${background}); color: var(--light);`)
          } else {
            document.body.classList.remove('dark')
            document.body.setAttribute('style', `--color: var(--${color}); color: var(--color);`)
          }
        }
      })
    }
  }
</script>

<svelte:window bind:scrollY bind:innerHeight />

<p class="p2 center padded">{index.description}</p>

{#each index.pagesCollection.items as page, i}
<section bind:this={elements[page.id]} id={page.id}
  data-color={page.couleur ? page.couleur.toLowerCase() : 'dark'}
  data-background-color={page.fonce ? page.couleur ? page.couleur.toLowerCase() : 'dark' : undefined}
  data-titre={page.titre}
  class="padded">
  <aside class="sticky">
    <div>
      <h2 class="p3">
        {#if page.id === 'soutenir'}
        <a href="https://www.museejoliette.org/fr/donnez/" class="button" rel="external" target="_blank">{page.titre} <Fleche /></a>
        {:else}
        <a href="/{page.id}" class="button" sveltekit:prefetch>{page.titre} <Fleche /></a>
        {/if}
      </h2>
      {#if page.description}<p>{page.description}</p>{/if}
      {#if page.liensCollection}
      <nav>
        {#each page.liensCollection.items as lien}
        <Link button {lien} /><br />
        {/each}
      </nav>
      {/if}
    </div>

    {#if i < index.pagesCollection.items.length - 1}
    <nav class="jumps">
      {#each index.pagesCollection.items as _page, _i}
      {#if page.id !== _page.id}
      <a href="#{_page.id}">{_page.titre} {#if _i > i}<span class="down">↓</span>{:else}<span class="up">↑</span>{/if}</a>
      {/if}
      {/each}
    </nav>
    {/if}
  </aside>

  <div>
    <Document body={page.intro} animation={TextAnimation} />
    {#if page.gallerie}
    <Gallerie entry={page.gallerie} />
    {/if}

    {#if page.id === 'explorer'}
    <Articles tight articles={[...articles,...activites,...balados]} />
    {:else if page.id === 'expositions'}
    <Expositions expositions={expositions.slice(0, 3)} />
    <div class="flex flex--end">
      <a href="/expositions" class="button">Voir l’Archive →</a>
    </div>
    <Expositions expositions={expositions.slice(3, 10)} tight />
    {/if}
  </div>

  
</section>
{/each}

<style lang="scss">
  $height: calc(100vh - 11rem);
  $columnwidth: 25%;

  p {
    width: 100%;
    max-width: 42rem;
    margin: 0 auto 1em;

    &.center {
    @media (max-width: 888px) {
      display: none;
    }
    }
  }

  section {
    min-height: 100vh;
    padding-bottom: 25vh;

    @media (max-width: 888px) {
      padding-bottom: 10vh;

      aside {
        h2 {
          // text-align: center;
          padding-bottom: var(--gutter);
        }
      }
    }

    .sticky {
      top: 10rem;
      width: $columnwidth;
      height: $height;

      display: flex;
      flex-direction: column;
      justify-content: space-between;
      
      .jumps {
        display: flex;
        justify-content: space-between;

        a {
          font-size: 0.88em;

          span {
            display: inline-block;
            transition: transform 333ms;
          }

          &:hover,
          &:focus {
            span {
              transform: translateY(-0.25em);

              &.down {
                transform: translateY(0.25em);
              }
            }
          }
        }

        @media (max-width: 888px) {
          display: none;
        }
      }

      @media (max-width: 888px) {
        position: relative;
        top: 0;
        height: auto;
        width: 100%;
      }
    }

    > div {
      margin-top: calc($height * -1);
      margin-left: $columnwidth;
      padding-left: var(--gutter);

      @media (max-width: 888px) {
        margin: 0;
        padding-left: 0;
      }

      > :global(p) {
        font-size: 2rem;
        line-height: 1;
        font-weight: bold;

        > :global(strong) {
          font-size: 6rem;
          font-weight: normal;

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