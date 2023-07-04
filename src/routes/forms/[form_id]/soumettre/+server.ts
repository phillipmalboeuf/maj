import { cma } from '$lib/clients/contentful_management'
import type { RequestHandler } from '@sveltejs/kit'
import slugify from 'slug'

export const POST: RequestHandler = async ({ request, ...event }) => {
  const formData = await request.formData()
  
  let data: any = {}
  formData.forEach((d, k) => data[k] = d)
  const { form, titre, nom, email, date, ville, file, accept, bref, ...details } = data

  if (accept) { return }

  const space = await cma.getSpace('hlfxtjh4lx5k')
  const environment = await space.getEnvironment('master')
  let asset

  if (file && file !== 'undefined') {
  const [id, contentType, fileName] = file.split('.')
  asset = await environment.createAsset({
    fields: {
      title: {
        'fr-CA': titre
      },
      description: {
        'fr-CA': ''
      },
      file: {
        'fr-CA': {
          contentType,
          fileName,
          uploadFrom: {
            sys: {
              type: "Link",
              linkType: "Upload",
              id
            }
          }
        }
      }
    }
  })
  await asset.processForAllLocales()
  }

  const entry = await environment.createEntry('soumission', {
    fields: {
      titre: { 'fr-CA': titre },
      id:  { 'fr-CA': slugify(titre).toLowerCase() },
      // description: { 'fr-CA': `<p>${bref}</p><p>${commentaires}</p>` },
      nom: { 'fr-CA': nom },
      email: { 'fr-CA': email },
      date: { 'fr-CA': date },
      ville: { 'fr-CA': ville },
      bref: { 'fr-CA': bref },
      details: { 'fr-CA': details },
      ...asset ? { media: { 'fr-CA': { sys: {
        id: asset.sys.id,
        linkType: "Asset",
        type: "Link",
      } } } } : {}
    }
  })
 
  return new Response(undefined, {
    status: 303,
    headers: {
      location: `/forms/${form}/soumissions/${entry.fields.id['fr-CA']}`
    }
  })
}