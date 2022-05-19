export const media = `{
  fileName
  url
  contentType
  title
  description
  width
  height
}`

export const contenuCollection = `contenuCollection(limit: 12) {
  items {
    __typename
    ... on Text {
      titre
      titreInvisible
      pleinePage
      media ${media}
      corps {
        json
      }
    }
    ... on Gallerie {
      titre
      titreInvisible
      colonnes
      alignement
      mediasCollection(limit: 8) {
        items ${media}
      }
    }
    ... on Slider {
      titre
      titreInvisible
      slidesCollection(limit: 12) {
        items {
          ... on Text {
            titre
            titreInvisible
            corps {
              json
            }
          }
        }
      }
    }
  }
}`