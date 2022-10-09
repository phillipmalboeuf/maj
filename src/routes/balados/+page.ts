import { query } from '$lib/clients/contentful'
import { contenuCollection, media } from '$lib/nodes'

export interface BaladoDocument {
  __typename: string
  titre: string
  titreCourt?: string
  id: string
  date: string
  embed: string
  audio: object
  media: object
  personnesCollection: {
    items: {
      nom: string
      id: string
      position: string
    }[]
  }
  sys: {
    id: string
  }
  intro: {
    json: object
  }
  introduction: {
    json: object
  }
  liens: object
}

/** @type {import('@sveltejs/kit').PageLoad} */
export async function load({ fetch, params }) {
  const { data } = await query<{
    page: PageDocument
    baladoCollection: {
      items: BaladoDocument[]
    }
  }>(fetch, `
      query {
        page(id: "2iqQrSM1C0u4j1Tzhmoamx") {
          titre
          id
          description
          couleur
          ${contenuCollection}
        }
        baladoCollection(order: [date_DESC], limit: 10) {
          items {
            __typename
            titre
            titreCourt
            id
            date
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
      }
    `)
  if (data) {
    return { 
  page: data.page,
  balados: data.baladoCollection.items
}
  }
}
