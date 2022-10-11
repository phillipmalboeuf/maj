import { query } from '$lib/clients/contentful'
import { contenuCollection, media } from '$lib/nodes'
import type { OeuvreDocument } from '$lib/components/Oeuvres.svelte'
import type { SoumissionDocument } from '../forms/[form_id]/soumissions/[id]/+page'
import type { PageDocument } from '$lib/components/Page.svelte'

export interface ExpositionDocument {
  titre: string
  titreCourt?: string
  id: string
  debut: string
  fin: string
  description?: string
  sys: {
    id: string
  }
  media: object
  oeuvresCollection: {
    items: SoumissionDocument[]
  }
}

/** @type {import('@sveltejs/kit').PageLoad} */
export async function load({ fetch, params }) {
  const { data } = await query<{
    page: PageDocument
    expositionCollection: {
      items: ExpositionDocument[]
    }
  }>(fetch, `
      query {
        page(id: "2kSFcw8y6f6cAVCN10AeY1") {
          titre
          id
          description
          couleur
        }
        expositionCollection(order: [debut_DESC]) {
          items {
            sys {
              id
            }
            media ${media}
            titre
            titreCourt
            id
            debut
            description {
              json
            }
            oeuvresCollection(limit: 30) {
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
                  date
                  nom
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
    `)
  if (data) {
    return { 
  page: data.page,
  expositions: data.expositionCollection.items
}
  }
}
