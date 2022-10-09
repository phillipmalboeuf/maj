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
            media ${media}
            ${contenuCollection}
          }
        }
      }
    `, {
    id: params.page
  })
  if (data && data.pageCollection.items.length > 0) {
    return { 
  page: data.pageCollection.items[0]
}
  }
}
