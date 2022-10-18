import { query } from '$lib/clients/contentful'
import { cma } from '$lib/clients/contentful_management'
import { prisma } from '$lib/clients/prisma'
import type { RequestHandler } from '@sveltejs/kit'
import slugify from 'slug'
import { readdir, readFile, stat } from 'fs/promises'
import { getType } from 'mime'

async function getFiles(path = "./") {
    const entries = await readdir(path, { withFileTypes: true });

    // Get files within the current directory and add a path key to the file objects
    const files = entries
        .filter(file => !file.isDirectory())
        .map(file => ({ ...file, path: path + file.name }));

    // Get folders within the current directory
    const folders = entries.filter(folder => folder.isDirectory());

    for (const folder of folders)
        /*
          Add the found files within the subdirectory to the files array by calling the
          current function itself
        */
        files.push(...await getFiles(`${path}${folder.name}/`));

    return files;
}

export const GET: RequestHandler = async ({ request, ...event }) => {

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

  // const expos = (await prisma.expositions.findMany())
  const oeuvres = (await prisma.oeuvres.findMany()).filter(o => o.exposition && o.exposition !== 'recF3jdd3ZaAyekPu' && o.exposition !== 'recc8ZCJO2OFrVOAN')

  const files = await getFiles('./_ignore/')

  // console.log(files)
  console.log(oeuvres.length)

  for (let i = 1192; i < oeuvres.length; i++) {
    const oeuvre = oeuvres[i]

    console.log(i)
    console.log(oeuvre)

    // let asset: Asset

    // try {
    //   const { name, path } = files.find(f => f.name.includes(oeuvre.fichier_photo))
    //   const file = await readFile(path)

    //   // const expo = await environment.getEntry(expositionCollection.items.find(item => item.titre === expos.find(e => e.id === oeuvre.exposition).titre).sys.id)
    //   // console.log(expo.fields)
    //   // const asset = assetCollection.items.find(a => a.fileName.includes(oeuvre.fichier_photo))
    //   asset = await environment.createAssetFromFiles({
    //     fields: {
    //       title: {
    //         'fr-CA': oeuvre.fichier_photo
            
    //       },
    //       description: {
    //         'fr-CA': ''
    //       },
    //       file: {
    //         'fr-CA': {
    //           contentType: getType(name),
    //           fileName: name,
    //           file
    //         }
    //       }
    //     }
    //   })
    //   await asset.processForAllLocales()
    // } catch (error) {
    //   console.error(oeuvre.fichier_photo)
    // }
    
    const entry = await environment.getEntry(oeuvre.id)
    console.log(entry)
    if(entry.fields.media) {
    const asset = await environment.getAsset(entry.fields.media['fr-CA'].sys.id)
    console.log(asset)
    await asset.publish()
    }
    // const entry = await environment.getEntry(oeuvre.id).catch(() => null) || await environment.createEntryWithId('soumission', oeuvre.id, {
    //   fields: {
    //     titre: { 'fr-CA': oeuvre.titre_de_loeuvre },
    //     id:  { 'fr-CA': slugify(oeuvre.titre_de_loeuvre).toLowerCase() },
    //     // description: { 'fr-CA': `<p>${bref}</p><p>${commentaires}</p>` },
    //     nom: { 'fr-CA': oeuvre.nom_du_cr_ateur },
    //     email: { 'fr-CA': oeuvre.courriel_du_cr_ateur },
    //     date: { 'fr-CA': oeuvre.date_de_soumission },
    //     ville: { 'fr-CA': oeuvre.ville_du_cr_ateur },
    //     age: { 'fr-CA': oeuvre.ge_du_cr_ateur },
    //     bref: { 'fr-CA': oeuvre.description },
    //     // details: { 'fr-CA': details },
    //     ...asset && { media: { 'fr-CA': { sys: {
    //       id: asset.sys.id,
    //       linkType: "Asset",
    //       type: "Link",
    //     } } } }
    //   }
    // })

    // console.log(entry)
    // await expo.patch([
    //   { op: 'add', path: '/fields/oeuvres/fr-CA/-', value: { sys: {
    //       id: entry.sys.id,
    //       linkType: "Entry",
    //       type: "Link",
    //     } } }
    // ])

    // await entry.publish()
    // await expo.publish()
  }
 
  return new Response(JSON.stringify(oeuvres, null, 2))
}