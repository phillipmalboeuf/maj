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
        type: string
        emphasis: boolean
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
            inputsCollection {
              items {
                label
                id
                type
                emphasis
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

	export let page: PageDocument
  export let form: FormDocument
</script>

<Page {page} noTitre />

<article class="padded">
  <h1 class="center">{form.titre}</h1>

  <!-- <h1 class="d1 center">{page.titre}</h1> -->

  <form class="flex flex--center padded">
    <Inputs {form} emphasis />
    <Inputs {form} />

    <button type="submit">{form.cta || 'Envoyer'}</button>
  </form>
</article>

<style lang="scss">
  article {
    color: var(--color);
  }

  button {
    position: fixed;
    bottom: var(--gutter);
    right: var(--gutter);
    color: var(--light);
    background-color: var(--vert);
    border-color: transparent;
    z-index: 14;
    margin-top: var(--gutter);
  }
</style>