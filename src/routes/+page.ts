import { query } from '$lib/clients/contentful'
import { contenuCollection, media } from '$lib/nodes'

import type { PageLoad } from './$types'
import type { ExpositionDocument } from './expositions/+page'
import type { PageDocument } from '$lib/components/Page.svelte'

export const load: PageLoad = async ({ fetch, params }) => {
  const { data } = await query(fetch, `
      query {
        index(id: "1AWDRdqrE2Jks9micYfzwG") {
          titre
          id
          description
          pagesCollection {
            items {
              ... on Page {
                titre
                id
                description
                couleur
                fonce
                intro {
                  json
                }
                gallerie {
                  titre
                  titreInvisible
                  colonnes
                  alignement
                  mediasCollection(limit: 8) {
                    items ${media}
                  }
                }
                liensCollection(limit: 5) {
                  items {
                    titre
                    lien
                    externe
                  }
                }
                articlesCollection(limit: 12) {
                  items {
                    __typename
                    ... on Article {
                      titre
                      titreCourt
                      vedette
                      id
                      date
                      media ${media}
                      personnesCollection(limit: 2) {
                        items {
                          nom
                          id
                          position
                        }
                      }
                    }
                    ... on Activity {
                      titre
                      titreCourt
                      id
                      date
                      media ${media}
                      personnesCollection(limit: 2) {
                        items {
                          nom
                          id
                          position
                        }
                      }
                    }
                    ... on Balado {
                      titre
                      titreCourt
                      id
                      date
                      media ${media}
                      personnesCollection(limit: 2) {
                        items {
                          nom
                          id
                          position
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        expositionCollection(order: [debut_DESC], limit: 16) {
          items {
            __typename
            titre
            titreCourt
            id
            debut
            media ${media}
            oeuvresCollection(limit: 1) {
              items {
                ... on Oeuvre {
                  titre
                  media ${media}
                }
                ... on Soumission {
                  titre
                  media ${media}
                }
              }
            }
            curatorsCollection(limit: 2) {
              items {
                nom
                id
                position
              }
            }
          }
        }
      }
    `)
  if (data) {
    return { 
      index: data.index as {
        titre: string
        id: string
        description: string
        pagesCollection: {
          items: PageDocument[]
        }
      },
      // articles: data.articleCollection.items,
      // balados: data.baladoCollection.items,
      // activites: data.activityCollection.items,
      expositions: data.expositionCollection.items as ExpositionDocument[]
    }
  }
}
