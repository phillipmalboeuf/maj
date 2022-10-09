import { query } from '$lib/clients/contentful'
import { contenuCollection, media } from '$lib/nodes'

/** @type {import('@sveltejs/kit').PageLoad} */
export async function load({ fetch, params }) {
  const { data } = await query(fetch, `
      query($id: String!) {
        pageCollection(limit: 1, where: {id: $id}) {
          items {
            titre
            id
            description
            couleur
            ${contenuCollection}
          }
        }
        articleCollection(limit: 6, order: date_DESC) {
          items {
            __typename
            titre
            id
            titreCourt
            date
            media ${media}
          }
        }
        baladoCollection(limit: 6, order: date_DESC) {
          items {
            __typename
            titre
            id
            titreCourt
            date
            media ${media}
          }
        }
        activityCollection(limit: 6, order: date_DESC) {
          items {
            __typename
            titre
            id
            titreCourt
            date
            media ${media}
          }
        }
      }
    `, {
    id: "explorer"
  })
  if (data && data.pageCollection.items.length > 0) {
    return { 
  page: data.pageCollection.items[0],
  articles: data.articleCollection.items,
  balados: data.baladoCollection.items,
  activites: data.activityCollection.items
}
  }
}
