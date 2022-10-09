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
        articleCollection(limit: 3, order: date_DESC, where: { type_not: "Activité" }) {
          items {
            __typename
            titre
            id
            titreCourt
            vedette
            date
            media ${media}
            personnesCollection {
              items {
                id
                nom
              }
            }
          }
        }
        baladoCollection(limit: 6, order: date_DESC) {
          items {
            __typename
            titre
            id
            titreCourt
            date
            embed
            audio ${media}
            media ${media}
            liens
            intro {
              json
            }
            introduction {
              json
            }
          }
        }
        activityCollection(limit: 3, order: date_DESC) {
          items {
            __typename
            titre
            id
            titreCourt
            date
            media ${media}
            personnesCollection {
              items {
                id
                nom
              }
            }
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
