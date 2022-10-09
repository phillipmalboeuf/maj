import { query } from '$lib/clients/contentful'
import { contenuCollection, media } from '$lib/nodes'

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
        oeuvreCollection(limit: 1, where: {id: $id}) {
          items {
            titre
            id
            media ${media}
            description {
              json
            }
          }
        }
        soumissionCollection(limit: 1, where: {id: $id}) {
          items {
            titre
            id
            nom
            date
            ville
            media ${media}
            details
            bref
            description {
              json
            }
          }
        }
      }
    `, {
    pageId: "2kSFcw8y6f6cAVCN10AeY1",
    id: params.id
  })
  if (data && data.oeuvreCollection.items.length > 0) {
    return { 
  page: data.page,
  oeuvre: data.oeuvreCollection.items[0]
}
  }
  if (data && data.soumissionCollection.items.length > 0) {
    return { 
  page: data.page,
  oeuvre: data.soumissionCollection.items[0]
}
  }
}
