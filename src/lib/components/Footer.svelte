<script lang="ts">
  import Locale from './Locale.svelte'
  import NewsletterForm from './NewsletterForm.svelte'
</script>

<footer class="grid grid--halves small padded">
  <nav>
    <div class="grid grid--sixths">
    <a href="/">Accueil</a>
    <a href="/">Expositions</a>
    <a href="/">Explorer</a>
    <a href="/">À propos</a>
    <a href="/">Participer</a>
    <a href="/">Soutenir</a>
    </div>

    <br>

    <div class="grid grid--sixths">
    <a href="/">Facebook</a>
    <a href="/">Twitter</a>
    <a href="/">YouTube</a>
    <a href="/">Instagram</a>
    <a href="/">Contact</a>
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
    <a href="/">Privacy policy</a>
    <a href="/">© 2022 par Musée d'art de Joliette</a>
    <a href="/">Designed by Paprika</a>
  </nav>
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