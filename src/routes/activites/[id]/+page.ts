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
        activityCollection(limit: 1, where: {id: $id}) {
          items {
            __typename
            titre
            titreCourt
            id
            date
            intro {
              json
            }
            media ${media}
            personnesCollection {
              items {
                nom
                id
                position
              }
            }
            theme {
              titre
              titreCourt
              id
            }
            ${contenuCollection}
          }
        }
      }
    `, {
    pageId: "2iqQrSM1C0u4j1Tzhmoamx",
    id: params.id
  })
  if (data && data.activityCollection.items.length > 0) {
    return { 
  page: data.page,
  activity: data.activityCollection.items[0]
}
  }
}
