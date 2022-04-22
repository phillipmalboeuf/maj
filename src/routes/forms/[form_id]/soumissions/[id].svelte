<script context="module" lang="ts">
  import { query } from '$lib/clients/contentful'
  import { media } from '../../../[page].svelte'

  export interface SoumissionDocument {
    titre: string
    id: string
    media: object
    date: string
    email: string
    nom: string
    ville: string
    details: object
    description: {
      json: object
    }
  }

  /** @type {import('@sveltejs/kit').Load} */
  export async function load({ fetch, params }) {
    const { data } = await query(fetch, `
      query($pageId: String!, $id: String!, $form_id: String!) {
        page(id: $pageId) {
          titre
          id
          description
          couleur
        }
        formCollection(limit: 1, where: {id: $form_id}) {
          items {
            titre
            id
          }
        }
        soumissionCollection(limit: 1, where: {id: $id}, preview: true) {
          items {
            titre
            id
            nom
            date
            ville
            media ${media}
            details
          }
        }
      }
    `, {
      pageId: "2ckTUqPtI3lSoLVJ67OVCv",
      id: params.id,
      form_id: params.form_id
    }, true)
    if (data && data.formCollection.items.length > 0 && data.soumissionCollection.items.length > 0) {
      return {
        props: { 
          page: data.page,
          form: data.formCollection.items[0],
          soumission: data.soumissionCollection.items[0],
        }
      }
    }
  }
</script>

<script lang="ts">
  import { onMount } from 'svelte'

  import Page, { type PageDocument } from '$lib/components/Page.svelte'
  import type { FormDocument } from '../../[id].svelte'
  import Document from '$lib/components/document/Document.svelte'
  import Picture from '$lib/components/Picture.svelte'
  import ParticiperSteps from '$lib/components/ParticiperSteps.svelte'

  import { DateTime } from 'luxon'

	export let page: PageDocument
  export let form: FormDocument
  export let soumission: SoumissionDocument
</script>

<Page {page} noTitre />

<article class="padded">
  <h1 class="center">{form.titre}</h1>
  
  {#if form.id === 'participer'}
  <ParticiperSteps current={3} />
  {/if}

  <div class="grid grid--thirds">
    <aside>
      <h1>{soumission.titre}</h1>
      <h2>
        {soumission.nom}<br>
        {soumission.ville}<br>
        {soumission.date && DateTime.fromISO(soumission.date).toFormat('yyyy.ll.dd')}
      </h2>

      {#if soumission.details}
      {#each Object.values(soumission.details) as detail}
      <p>{detail}</p>
      {/each}
      {/if}
    </aside>
    <figure>
      <Picture media={soumission.media} zoom />
    </figure>
  </div>
</article>

<style lang="scss">
  article {
    color: var(--color);
  }
</style>