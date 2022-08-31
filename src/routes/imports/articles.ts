import { query } from '$lib/clients/contentful'
import { cma } from '$lib/clients/contentful_management'
import { prisma } from '$lib/clients/prisma'
import type { RequestHandler } from '@sveltejs/kit'
import slugify from 'slugify'

export const GET: RequestHandler<{ titre: string }, {}> = async ({ request, ...event }) => {

  const { data: { articleCollection: { items } } } = await query<{
      articleCollection: {
        items: {
          titre: string
          id: string
          sys?: {
            id: string
            publishedVersion: number
          }
        }[]
      }
    }>(fetch, `
      query {
        articleCollection(limit: 300, preview: true) {
          items {
            sys {
              id
              publishedVersion
            }
            titre
            id
          }
        }
      }
    `, {}, true)

  const space = await cma.getSpace('hlfxtjh4lx5k')
  const environment = await space.getEnvironment('master')

  console.log(items.length)


  for (let i = 0; i < items.length; i++) {
    const article = items[i]
    const asset = (await environment.getAssets({ 'fields.title': article.titre })).items[0]
    const entry = await environment.getEntry(article.sys.id)
    console.log(article)
    console.log(asset)

    if (asset) {
    await entry.patch([
      {
        op: 'replace',
        path: '/fields/media/fr-CA',
        value: { "sys": {        
          "id": asset.sys.id,        
          "linkType": "Asset",        
          "type": "Link" } }
      }
    ])
    }

    // await environment.update()
  }
 
  return {
    body: JSON.stringify(items, null, 2)
  }
}