import { query } from '$lib/clients/contentful'
import { contenuCollection, media } from '$lib/nodes'

export interface ThemeDocument {
  __typename: string
  sys: {
    id: string
  }
  titre: string
  titreCourt?: string
  id: string
  date: string
  intro?: {
    json: object
  }
  personnesCollection: {
    items: {
      nom: string
      id: string
      position: string
    }[]
  }
}

import type { PageLoad } from '@sveltejs/kit'
export const load: PageLoad = async ({ fetch, params }) => {
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
        themeCollection(limit: 1, order: date_DESC) {
          items {
            __typename
            titre
            id
            titreCourt
            date
            intro {
              json
            }
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
    id: "participer"
  })
  if (data && data.pageCollection.items.length > 0) {
    return {
  page: data.pageCollection.items[0],
  theme: data.themeCollection.items[0]
}
  }
}
