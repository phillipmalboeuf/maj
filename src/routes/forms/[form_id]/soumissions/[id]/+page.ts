import { query } from '$lib/clients/contentful'
import { contenuCollection, media } from '$lib/nodes'

export interface SoumissionDocument {
  titre: string
  id: string
  media: object
  date: string
  email: string
  nom: string
  ville: string
  details: object
  bref: string
  description: {
    json: object
  }
}

/** @type {import('@sveltejs/kit').PageLoad} */
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
            bref
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
  page: data.page,
  form: data.formCollection.items[0],
  soumission: data.soumissionCollection.items[0],
}
  }
}
