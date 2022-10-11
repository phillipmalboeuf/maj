<script lang="ts">
  import { titre } from '$lib/stores'
  import type { ExpositionDocument } from 'src/routes/expositions/[id]/+page'
  import ExpoOverlay from './ExpoOverlay.svelte'

  export let expo: ExpositionDocument
  export let type = 'slider'
  export let noDescription = false

  let open = false
</script>

<style lang="scss">
  svg {
    path {
      fill: none;
    }
  }

  a {

    &.active,
    &:hover,
    &:focus {
      svg {
        path,
        rect {
          fill: currentColor;
        }
      }
      
      svg:not(.folder) {
        path,
        rect {
          stroke: var(--light);
        }
      }
    }

    &.retour {

      &:after {
        content: " ×";
      }
    }
  }
</style>
<span class="flex flex--middle flex--tight">
  {#if !noDescription}<a href="/expositions/{expo.id}" class="button" on:click|preventDefault={() => open = true}>Description de l’expo</a>{/if}
  <a class:active={type === 'folder'} href="/expositions#{expo.id}">
    <svg class="folder" width="21" height="17" viewBox="0 0 21 17" fill="none">
    <path d="M2.5 1.5C1.94772 1.5 1.5 1.94772 1.5 2.5V14.5001C1.5 15.0524 1.94771 15.5001 2.5 15.5001H18.3889C18.9412 15.5001 19.3889 15.0524 19.3889 14.5001V4.83342C19.3889 4.28114 18.9412 3.83342 18.3889 3.83342H11.6818V2.5C11.6818 1.94772 11.2341 1.5 10.6818 1.5H2.5Z" fill="none"/>
    <path d="M2.5 1C1.67157 1 1 1.67157 1 2.5V14.5001C1 15.3285 1.67157 16.0001 2.5 16.0001H18.3889C19.2173 16.0001 19.8889 15.3285 19.8889 14.5001V4.83342C19.8889 4.00499 19.2173 3.33342 18.3889 3.33342H12.1818V2.5C12.1818 1.67157 11.5102 1 10.6818 1H2.5Z" fill="none" stroke="currentColor" stroke-linejoin="round"/>
    </svg>
  </a>
  <a class:active={type === 'slider'} class:retour={type === 'slider'} href={type === 'slider' ? `/expositions#${expo.id}` : `/expositions/${expo.id}/oeuvres?type=slider`}>
    <svg width="28" height="18" viewBox="0 0 28 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="1" width="7.3" height="8" fill="none" stroke="currentColor"/>
    <rect x="8.2998" y="1" width="11.5441" height="15.62" fill="none" stroke="currentColor"/>
    <rect x="19.8442" y="1" width="7.3" height="8" fill="none" stroke="currentColor"/>
    </svg>
  </a>
  <a class:active={type === 'mur'} class:retour={type === 'mur'} href={type === 'mur' ? `/expositions#${expo.id}` : `/expositions/${expo.id}/oeuvres?type=mur`}>
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <rect width="14.6218" height="14.6218" transform="translate(1.5 1.5)" fill="none"/>
    <rect x="1" y="1" width="7.81092" height="7.81092" stroke="currentColor"/>
    <rect x="8.81104" y="1" width="7.81092" height="7.81092" stroke="currentColor"/>
    <rect x="1" y="8.81104" width="7.81092" height="7.81092" stroke="currentColor"/>
    <rect x="8.81104" y="8.81104" width="7.81092" height="7.81092" stroke="currentColor"/>
    </svg>
  </a>
</span>

<ExpoOverlay bind:open={open} exposition={expo} />