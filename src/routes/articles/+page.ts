import { query } from '$lib/clients/contentful'
import { contenuCollection, media } from '$lib/nodes'

export interface ArticleDocument {
  __typename: string
  titre: string
  titreCourt?: string
  id: string
  date: string
  vedette?: boolean
  media?: object
  hideMedia?: boolean
  sys: {
    id: string
  }
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
  theme?: {
    titre: string
    titreCourt?: string
    id: string
  }
  contenuCollection?: {
    items: any[]
  }
}

/** @type {import('@sveltejs/kit').PageLoad} */
export async function load({ fetch, params, url }) {
  const { data } = await query<{
    page: PageDocument
    articleCollection: {
      items: ArticleDocument[]
    }
  }>(fetch, `
      query($skip: Int) {
        page(id: "2iqQrSM1C0u4j1Tzhmoamx") {
          titre
          id
          description
          couleur
          ${contenuCollection}
        }
        articleCollection(order: [date_DESC], limit: 12, skip: $skip, where: { type_not: "Activité" }) {
          items {
            titre
            titreCourt
            id
            date
            vedette
            media ${media}
            personnesCollection(limit: 6) {
              items {
                nom
                id
                position
              }
            }
            ${contenuCollection}
          }
        }
      }
    `, {
    skip: url.searchParams.has('p') ? parseInt(url.searchParams.get('p')) * 12 : 0
  })
  if (data) {
    return { 
  page: data.page,
  articles: data.articleCollection.items,
  p: url.searchParams.has('p') ? parseInt(url.searchParams.get('p')) : 0
}
  }
}
