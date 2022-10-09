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
        expos: expositionCollection(order: [debut_DESC]) {
          items {
            sys {
              id
            }
            titre
            id
          }
        }
        expositionCollection(limit: 1, where: {id: $id}) {
          items {
            titre
            id
            titreCourt
            oeuvresCollection {
              items {
                ... on Oeuvre {
                  titre
                  id
                  media ${media}
                }
                ... on Soumission {
                  titre
                  id
                  bref
                  date
                  nom
                  media ${media}
                  description {
                    json
                  }
                }
              }
            }
          }
        }
      }
    `, {
    pageId: "2kSFcw8y6f6cAVCN10AeY1",
    id: params.id
  })
  if (data && data.expositionCollection.items.length > 0) {
    return { 
  page: data.page,
  exposition: data.expositionCollection.items[0],
  expos: data.expos.items,
  oeuvres: data.expositionCollection.items[0].oeuvresCollection.items
}
  }
}
