<script lang="ts">
  export let current: string = undefined
</script>

<style lang="scss">
  svg {
    path {
      fill: none;
    }
  }

  nav {
    color: var(--color);
  }

  a {

    &.active,
    &:hover,
    &:focus {
      
    }

    &.active {
      border-radius: 0;
      color: var(--light);
      background-color: var(--color);
    }
  }
</style>

<nav class="padded flex flex--tight flex--center flex--middle">
  <a class:active={current === 'articles'} href={current === 'articles' ? "/explorer" : "/articles"} class="button">Articles</a>
  <a class:active={current === 'balados'} href={current === 'balados' ? "/explorer" : "/balados"} class="button">Balados</a>
  <a class:active={current === 'activites'} href={current === 'activites' ? "/explorer" : "/activites"} class="button">Activités</a>
  <a class:active={current === 'archives'} href={current === 'archives' ? "/explorer" : "/archives"}>
    <svg class="folder" width="21" height="17" viewBox="0 0 21 17" fill="none">
    <path d="M2.5 1.5C1.94772 1.5 1.5 1.94772 1.5 2.5V14.5001C1.5 15.0524 1.94771 15.5001 2.5 15.5001H18.3889C18.9412 15.5001 19.3889 15.0524 19.3889 14.5001V4.83342C19.3889 4.28114 18.9412 3.83342 18.3889 3.83342H11.6818V2.5C11.6818 1.94772 11.2341 1.5 10.6818 1.5H2.5Z" fill="none"/>
    <path d="M2.5 1C1.67157 1 1 1.67157 1 2.5V14.5001C1 15.3285 1.67157 16.0001 2.5 16.0001H18.3889C19.2173 16.0001 19.8889 15.3285 19.8889 14.5001V4.83342C19.8889 4.00499 19.2173 3.33342 18.3889 3.33342H12.1818V2.5C12.1818 1.67157 11.5102 1 10.6818 1H2.5Z" fill="none" stroke="currentColor" stroke-linejoin="round"/>
    </svg>
  </a>
</nav>