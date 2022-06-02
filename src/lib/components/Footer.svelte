<script lang="ts">
  import { query } from '$lib/clients/contentful'

  import Locale from './Locale.svelte'
  import Link from './Link.svelte'
  import NewsletterForm from './NewsletterForm.svelte'
</script>

<footer class="grid grid--halves small padded">
  {#await query(fetch, `
    query {
      navigationCollection(limit: 3, order: sys_publishedAt_ASC) {
        items {
          titre
          liensCollection {
            items {
              titre
              lien
              externe
            }
          }
        }
      }
    }
  `) then { data } }
  <nav>
    <div class="grid grid--sixths">
    <a href="/">Accueil</a>
    {#each data.navigationCollection.items[0].liensCollection.items as lien, i}
    <Link {lien} />
    {/each}
    </div>

    <br>

    <div class="grid grid--sixths">
    {#each data.navigationCollection.items[1].liensCollection.items as lien, i}
    <Link {lien} />
    {/each}
    </div>
  </nav>

  <div class="flex flex--end">
    <Locale />
  </div>

  <hr>
  <hr>

  <nav class="flex">
    <NewsletterForm />
  </nav>

  <nav class="flex flex--end">
    {#each data.navigationCollection.items[2].liensCollection.items as lien, i}
    <Link {lien} />
    {/each}
  </nav>
  {/await}
</footer>

<style lang="scss">
  hr {
    margin-bottom: 2rem;
    border: none;
  }
  nav {
    &:last-child {
      opacity: 0.5;
    }
  }

  @media (max-width: 888px) {
    footer > div {
      order: -1;
    }

    nav {
      > div:first-child {
        display: none;
      }

      &:last-child {
        flex-direction: column;
      }
    }
  }
</style>