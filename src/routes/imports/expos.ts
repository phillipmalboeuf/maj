import { query } from '$lib/clients/contentful'
import { cma } from '$lib/clients/contentful_management'
import { prisma } from '$lib/clients/prisma'
import type { RequestHandler } from '@sveltejs/kit'
import slugify from 'slugify'

export const GET: RequestHandler<{ titre: string }, {}> = async ({ request, ...event }) => {

  const { data: { expositionCollection } } = await query<{
      expositionCollection: {
        items: {
          titre: string
          titreCourt?: string
          id: string
          sys?: {
            id: string
          }
        }[]
      }
    }>(fetch, `
      query {
        expositionCollection {
          items {
            sys {
              id
            }
            titre
            id
          }
        }
      }
    `)
  // const { data: { assetCollection } } = await query<{
  //     assetCollection: {
  //       total: number
  //       items: { fileName: string, sys: { id: string } }[]
  //     }
  //   }>(fetch, `
  //     query {
  //       assetCollection(limit: 200) {
  //         total
  //         items {
  //           sys {
  //             id
  //           }
  //           fileName
  //         }
  //       }
  //     }
  //   `)

  const space = await cma.getSpace('hlfxtjh4lx5k')
  const environment = await space.getEnvironment('master')

  const expos = (await prisma.expositions.findMany())
  // const oeuvres = (await prisma.oeuvres.findMany()).filter(o => o.exposition && o.exposition !== 'rec575hjduRuBY5bt')

  for (let i = 0; i < expos.length; i++) {
    const expo = expos[i]

    console.log(expo)

    // const asset = assetCollection.items.find(a => a.fileName.includes(oeuvre.fichier_photo))

    if (expositionCollection.items.find(e => e.titre === expo.titre)) { continue }
    
    const entry = await environment.getEntry(expo.id).catch(() => null) || await environment.createEntryWithId('exposition', expo.id, {
      fields: {
        titre: { 'fr-CA': expo.titre },
        titreCourt: { 'fr-CA': `Expo ${expo.num_ro}` },
        id:  { 'fr-CA': slugify(expo.titre).toLowerCase() },
        oeuvres: { 'fr-CA': expo.oeuvres.map(oeuvre => ({
          sys: {
            id: oeuvre,
            linkType: "Entry",
            type: "Link",
          } 
        })) }
      }
    })

    console.log(entry)
    await entry.publish()
  }
 
  return {
    body: JSON.stringify(expos, null, 2)
  }
}