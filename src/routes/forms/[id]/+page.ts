import { query } from '$lib/clients/contentful'

export interface FormDocument {
  titre: string
  id: string
  cta: string
  smallPrint: string
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

/** @type {import('@sveltejs/kit').PageLoad} */
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
            smallPrint
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
  page: data.page,
  form: data.formCollection.items[0]
}
  }
}
