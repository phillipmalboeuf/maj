import { query } from '$lib/clients/contentful'
import { cma } from '$lib/clients/contentful_management'
import type { RequestHandler } from '@sveltejs/kit'

export const GET: RequestHandler = async ({ request, ...event }) => {

  const { data: { assetCollection } } = await query<{
      assetCollection: {
        total: number
        items: { fileName: string, sys: { id: string, publishedAt: string } }[]
      }
    }>(fetch, `
      query {
        assetCollection(limit: 5000, skip: 3125, preview: true) {
          total
          items {
            sys {
              id
              publishedAt
            }
          }
        }
      }
    `, {}, true)

  const space = await cma.getSpace('hlfxtjh4lx5k')
  const environment = await space.getEnvironment('master')

  const assets = assetCollection.items.filter(item => item.sys.publishedAt)

  console.log(assets.length)

  for (let i = 0; i < assets.length; i++) {
    const asset = await environment.getAsset(assets[i].sys.id)
    console.log(i)
    console.log(asset)
    await asset.publish()
  }
 
  return new Response(JSON.stringify(assets, null, 2))
}