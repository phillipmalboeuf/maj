import { query } from '$lib/clients/contentful'
import { contenuCollection, media } from '$lib/nodes'
interface OeuvreDocument {
  titre: string
  id: string
  description?: object
  media?: object
  date: string
  bref: string
}

export interface ExpositionDocument {
  titre: string
  titreCourt?: string
  id: string
  debut: string
  fin: string
  description?: string
  media?: object
  sys?: {
    id: string
  }
  oeuvresCollection?: {
    items: OeuvreDocument[]
  }
  curatorsCollection?: {
    items: CuratorDocument[]
  }
}

export interface CuratorDocument {
  nom: string
  id: string
  position?: string
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
        expositionCollection(limit: 1, where: {id: $id}) {
          items {
            titre
            titreCourt
            id
            debut
            description {
              json
            }
            oeuvresCollection {
              items {
                ... on Oeuvre {
                  titre
                  id
                  media ${media}
                  description {
                    json
                  }
                }
                ... on Soumission {
                  titre
                  id
                  media ${media}
                  bref
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
  oeuvres: data.expositionCollection.items[0].oeuvresCollection.items,
}
  }
}
