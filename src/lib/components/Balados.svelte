<script lang="ts">
  import { date } from '$lib/formatters'

  import { DateTime, Duration } from 'luxon'
  import type { BaladoDocument } from 'src/routes/balados/index.svelte'
  import Audio from './Audio.svelte'
  import Document from './document/Document.svelte'
  import Fleche from './Fleche.svelte'
  import Picture from './Picture.svelte'

  export let balados: BaladoDocument[]

  let durations: {[id: string]: number} = {}
</script>

<section>
  {#if balados[0]}
  <figure class="flex">
    <figcaption class="flex__third">
      <a href="/balados/{balados[0].id}" class="button">Contenu du balado <Fleche /></a><br><br>
      <h5>{balados[0].titre}</h5>
      <Document body={balados[0].introduction || balados[0].intro} />
      {#if balados[0].liens}
      {#each Object.entries(balados[0].liens) as [label, href]}
      <a {href} target="_blank" class="button">{label}</a><br>
      {/each}
      {/if}
    </figcaption>

    <div>
      {#if balados[0].audio}
      <Audio visible media={balados[0].audio} bind:duration={durations[balados[0].id]} />
      {:else if balados[0].embed}
      <iframe src={balados[0].embed} loading="lazy" width="100%" height="200" frameborder="0" scrolling="no" title={balados[0].titre}></iframe>
      {/if}
    </div>
    
    <!-- <span><Picture media={balado.media} /></span> -->
    
  </figure>
  {/if}

  <h2 class="center">
    <svg width="86" height="65" viewBox="0 0 86 65" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M80.9897 38.5259C78.2651 35.7822 74.6995 34.1935 70.8785 34.0035V28.0751C70.8785 24.2853 70.1406 20.6084 68.6869 17.147C67.2824 13.8038 65.2724 10.8014 62.7125 8.22352C60.1526 5.64559 57.1712 3.62138 53.8514 2.20704C50.4142 0.742428 46.763 0 42.9997 0C39.2363 0 35.5852 0.742428 32.148 2.20639C28.8281 3.62072 25.8468 5.64493 23.2869 8.22286C20.727 10.8008 18.7169 13.8032 17.3125 17.1464C15.8588 20.6078 15.1215 24.2846 15.1215 28.0745V34.0028C11.3005 34.1928 7.7349 35.7822 5.0103 38.5253C2.10156 41.4552 0.5 45.3495 0.5 49.4919C0.5 53.6344 2.10156 57.5287 5.0103 60.4579C7.91904 63.3872 11.7861 65 15.8996 65H16.6777V28.0745C16.6777 24.4956 17.3734 21.0244 18.7461 17.7569C20.0721 14.6004 21.97 11.7659 24.3872 9.33096C26.8051 6.89603 29.6198 4.98478 32.7542 3.65011C35.9989 2.26777 39.4458 1.56713 42.9997 1.56713C46.5536 1.56713 50.0005 2.26777 53.2451 3.65011C56.3795 4.98543 59.1942 6.89668 61.6121 9.33096C64.03 11.7659 65.9279 14.6004 67.2532 17.7569C68.6259 21.0244 69.3217 24.4956 69.3217 28.0745V65H70.1004C74.2139 65 78.0809 63.3872 80.9897 60.4579C83.8984 57.5287 85.5 53.6344 85.5 49.4919C85.5 45.3495 83.8984 41.4552 80.9897 38.5259V38.5259ZM15.1215 63.4113C11.7161 63.2226 8.54151 61.7972 6.11064 59.3498C3.49628 56.7171 2.05617 53.2158 2.05617 49.4919C2.05617 45.768 3.49628 42.2675 6.11064 39.634C8.54086 37.186 11.7161 35.7613 15.1215 35.5726V63.4113V63.4113ZM70.8785 63.4113V35.5732C78.1516 35.9807 83.9438 42.0683 83.9438 49.4926C83.9438 56.9169 78.1516 63.0045 70.8785 63.412V63.4113Z" fill="currentColor"/>
    </svg>
    Écouter aussi
  </h2>

  <ol>
    {#each balados as balado, i}
    {#if i > 0}
    <li>
      <a class="flex flex--spaced" href="/balados/{balado.id}">
        <span>{balado.titre}</span>
        <!-- <span>{balado.titreCourt}</span> -->
        <span>{date(balado.date)}</span>
        <!-- <span>{durations[balado.id] && Duration.fromMillis(durations[balado.id]*1000).toFormat('mm:ss')}</span> -->
      </a>
    </li>

    <!-- <Audio visible={false} media={balado.audio} bind:duration={durations[balado.id]} /> -->
    {/if}
    {/each}
  </ol>
</section>

<style lang="scss">
  figure {
    padding: calc(var(--gutter) * 2) 0;

    @media (max-width: 888px) {
      flex-direction: column;
    }

    figcaption {
      width: calc((100% / 4) - var(--gap));
      @media (max-width: 888px) { width: 100%; }
    }

    div {
      flex: 1;
    }
  }

  ol {
    list-style: none;
    padding: 0;

    li {
      padding: calc(var(--gutter) / 2);
      border-top: 1px solid var(--dark-grey);
      max-width: 678px;
      margin: 0 auto;
    }
  }

  h2 {
    > svg {
      margin-bottom: 0.5em;
    }
  }

  .button {
    margin-bottom: 0.5em;
  }
</style>