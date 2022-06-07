import { query } from '$lib/clients/contentful'
import { cma } from '$lib/clients/contentful_management'
import { prisma } from '$lib/clients/prisma'
import type { RequestHandler } from '@sveltejs/kit'
import slugify from 'slugify'
import type { ExpositionDocument } from '../expositions/[id].svelte'

export const get: RequestHandler<{ titre: string }, {}> = async ({ request, ...event }) => {

  const { data: { expositionCollection } } = await query<{
      expositionCollection: {
        items: ExpositionDocument[]
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
  const { data: { assetCollection } } = await query<{
      assetCollection: {
        total: number
        items: { fileName: string, sys: { id: string } }[]
      }
    }>(fetch, `
      query {
        assetCollection(limit: 200) {
          total
          items {
            sys {
              id
            }
            fileName
          }
        }
      }
    `)

  const space = await cma.getSpace('hlfxtjh4lx5k')
  const environment = await space.getEnvironment('master')

  const expos = (await prisma.expositions.findMany())
  const oeuvres = (await prisma.oeuvres.findMany()).filter(o => o.exposition && o.exposition !== 'rec575hjduRuBY5bt')

  for (let i = 0; i < oeuvres.length; i++) {
    const oeuvre = oeuvres[i]

    console.log(oeuvre)

    const expo = await environment.getEntry(expositionCollection.items.find(item => item.titre === expos.find(e => e.id === oeuvre.exposition).titre).sys.id)
    const asset = assetCollection.items.find(a => a.fileName.includes(oeuvre.fichier_photo))
    
    const entry = await environment.getEntry(oeuvre.id).catch(() => null) || await environment.createEntryWithId('soumission', oeuvre.id, {
      fields: {
        titre: { 'fr-CA': oeuvre.titre_de_loeuvre },
        id:  { 'fr-CA': slugify(oeuvre.titre_de_loeuvre).toLowerCase() },
        // description: { 'fr-CA': `<p>${bref}</p><p>${commentaires}</p>` },
        nom: { 'fr-CA': oeuvre.nom_du_cr_ateur },
        email: { 'fr-CA': oeuvre.courriel_du_cr_ateur },
        date: { 'fr-CA': oeuvre.date_de_soumission },
        ville: { 'fr-CA': oeuvre.ville_du_cr_ateur },
        bref: { 'fr-CA': oeuvre.description },
        // details: { 'fr-CA': details },
        ...asset && { media: { 'fr-CA': { sys: {
          id: assetCollection.items.find(a => a.fileName.includes(oeuvre.fichier_photo)).sys.id,
          linkType: "Asset",
          type: "Link",
        } } } }
      }
    })

    console.log(entry)
    await expo.patch([
      { op: 'add', path: '/fields/oeuvres/fr-CA/-', value: { sys: {
          id: entry.sys.id,
          linkType: "Entry",
          type: "Link",
        } } }
    ])
    await entry.publish()
  }
 
  return {
    body: JSON.stringify(oeuvres, null, 2)
  }
}