<script context="module" lang="ts">
  import { query } from '$lib/clients/contentful'

  export interface FormDocument {
    titre: string
    id: string
    cta: string
    inputsCollection: {
      items: {
        label: string
        id: string
        placeholder: string
        type: string
        emphasis: boolean
        optionel: boolean
      }[]
    }
  }

  /** @type {import('@sveltejs/kit').Load} */
  export async function load({ fetch, params }) {
    const { data } = await query(fetch, `
      query($pageId: String!, $id: String!) {
        page(id: $pageId) {
          titre
          id
          description
          couleur
        }
        formCollection(limit: 1, where: {id: $id}) {
          items {
            titre
            id
            cta
            inputsCollection {
              items {
                label
                placeholder
                id
                type
                emphasis
                optionel
              }
            }
          }
        }
      }
    `, {
      pageId: "2ckTUqPtI3lSoLVJ67OVCv",
      id: params.id
    })
    if (data && data.formCollection.items.length > 0) {
      return {
        props: { 
          page: data.page,
          form: data.formCollection.items[0]
        }
      }
    }
  }
</script>

<script lang="ts">
  import { onMount } from 'svelte'

  import Page, { type PageDocument } from '$lib/components/Page.svelte'
  import Document from '$lib/components/document/Document.svelte'
  import Picture from '$lib/components/Picture.svelte'
  import Inputs from '$lib/components/Inputs.svelte'
  import ParticiperSteps from '$lib/components/ParticiperSteps.svelte'
  import Questions from '$lib/components/Questions.svelte'
  import { titre } from '$lib/stores'

	export let page: PageDocument
  export let form: FormDocument

  titre.set(form.titre)
</script>

<Page {page} noTitre />

<article class="padded">
  <h1 class="center h2">{form.titre}</h1>

  {#if form.id === 'participer'}
  <ParticiperSteps current={2} />
  {/if}

  <!-- <h1 class="d1 center">{page.titre}</h1> -->

  <form id="soumissions" action="/forms/{form.id}/soumettre" method="POST" enctype="multipart/form-data" class="padded">
    <input type="hidden" name="form" value={form.id}>
    <Inputs {form} emphasis />
    <br>
    <Inputs {form} />

    <input type="checkbox" name="accept" id="accept">
    <label for="accept">Accept <a href="/terms" target="_blank">terms and conditions</a></label>
  </form>
</article>

<a href="/participer" class="button">←</a>
<Questions spaced />
<button form="soumissions" type="submit">{form.cta || 'Envoyer'}</button>

<style lang="scss">
  article {
    color: var(--color);
  }

  form {
    max-width: 50vw;
    margin: 0 auto;

    @media (max-width: 888px) {
      max-width: none;
    }
  }

  button,
  .button {
    position: sticky;
    float: right;
    bottom: var(--gutter);
    right: var(--gutter);
    color: var(--light);
    background-color: var(--rouge);
    border-color: transparent;
    z-index: 14;
    margin-top: var(--gutter);
  }

  .button {
    float: none;
    left: var(--gutter);
  }

  input[name="accept"],
  input[name="accept"] + label {
    visibility: hidden;
    height: 0;
  }
</style>