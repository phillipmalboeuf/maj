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
        baladoCollection(limit: 1, where: {id: $id}) {
          items {
            __typename
            titre
            titreCourt
            id
            date
            embed
            audio ${media}
            media ${media}
            personnesCollection {
              items {
                nom
                id
                position
              }
            }
            liens
            intro {
              json
            }
            ${contenuCollection}
          }
        }
      }
    `, {
    pageId: "2iqQrSM1C0u4j1Tzhmoamx",
    id: params.id
  })
  if (data && data.baladoCollection.items.length > 0) {
    return { 
  page: data.page,
  balado: data.baladoCollection.items[0]
}
  }
}
