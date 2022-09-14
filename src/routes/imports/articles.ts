import { query } from '$lib/clients/contentful'
import { cma } from '$lib/clients/contentful_management'
import type { Asset, Environment } from 'contentful-management'
import { prisma } from '$lib/clients/prisma'
import type { RequestHandler } from '@sveltejs/kit'
import slugify from 'slugify'
import { getType } from 'mime'

import articles1 from './articles1.json'
import articles2 from './articles2.json'
import articles3 from './articles3.json'


const formatContent = async (node, environment: Environment) => {
  // console.log(node)

  let asset: Asset
  let link = node.textData?.decorations?.find(d => d.type === "LINK")

  if (node.type === 'IMAGE') {
    asset = await environment.createAsset({
      fields: {
        title: {
          'fr-CA': undefined
        },
        description: {
          'fr-CA': undefined
        },
        file: {
          'fr-CA': {
            contentType: getType(node.imageData.image.src.id),
            fileName: node.imageData.image.src.id,
            upload: `https://static.wixstatic.com/media/${node.imageData.image.src.id}`
          }
        }
      }
    })
    try {
      await asset.processForAllLocales()
    } catch (error) {
      console.error(error)
    }
  }

  const content = await Promise.all((node.type === "VIDEO" ? [{
    type: "TEXT",
    nodes: [],
    textData: {
      text: node.videoData.video.src.url || `https://static.wixstatic.com/media/${node.videoData.video.src.id}`,
      decorations: [
        {
          "type": "LINK",
          "linkData": {
            "link": {
              "url": node.videoData.video.src.url || `https://static.wixstatic.com/media/${node.videoData.video.src.id}`,
              "target": "BLANK"
            }
          }
        },
        {
          "type": "UNDERLINE"
        }
      ]
    }
  }] : node.type === "FILE" ? [{
    type: "TEXT",
    nodes: [],
    textData: {
      text: node.fileData.name || `https://static.wixstatic.com/media/${node.videoData.video.src.id}`,
      decorations: [
        {
          "type": "LINK",
          "linkData": {
            "link": {
              "url": node.fileData.src.url || `https://static.wixstatic.com/media/${node.fileData.src.id}`,
              "target": "BLANK"
            }
          }
        },
        {
          "type": "UNDERLINE"
        }
      ]
    }
  }] : node.type === "BUTTON" ? [{
    type: "TEXT",
    nodes: [],
    textData: {
      text: node.buttonData.text,
      decorations: [
        {
          "type": "LINK",
          "linkData": {
            "link": {
              "url": node.buttonData.link.url,
              "target": "BLANK"
            }
          }
        },
        {
          "type": "UNDERLINE"
        }
      ]
    }
  }] : node.type === "HTML" ? [{
    type: "TEXT",
    nodes: [],
    textData: {
      text: node.htmlData.html,
      decorations: [
        {
          "type": "CODE"
        }
      ]
    }
  }] : node.nodes).map(formatContent))

  return {
    nodeType: link
    ? 'hyperlink'
    : {
      'heading': 'heading-3',
      'bulleted_list': 'unordered-list',
      'ordered_list': 'ordered-list',
      'list_item': 'list-item',
      'image': 'embedded-asset-block',
      'video': 'paragraph',
      'file': 'paragraph',
      'button': 'paragraph',
      'html': 'paragraph',
      'gallery': 'ordered-list',
      'table_row': 'table-row',
      'table_cell': 'table-cell',
      'divider': 'hr'
    }[node.type.toLowerCase()] || node.type.toLowerCase(),
    data: {
      ...link && {
        uri: link.linkData.link.url
      },
      ...asset && {
        target: { sys: {
          id: asset.sys.id,
          type: "Link",
          linkType: "Asset"
        } }
      }
    },
    ...node.textData?.text && (link ? { content: [
      {
        nodeType: 'text',
        data: {},
        value: node.textData?.text,
        marks: node.textData?.decorations
          .filter(d => d.type !== "LINK" && d.type !== "COLOR" && d.type !== "ANCHOR")
          .map(d => ({ type: d.type.toLowerCase() }))
      }
    ] } : { value: node.textData?.text }) ,
    ...(!link && node.textData?.decorations?.filter(d => d.type !== "LINK")) && { marks: node.textData?.decorations
      .filter(d => d.type !== "LINK" && d.type !== "COLOR" && d.type !== "ANCHOR")
      .map(d => ({ type: d.type.toLowerCase() })) },
    ...(node.type !== "TEXT") && { content }
  }
}

export const GET: RequestHandler<{ titre: string }, {}> = async ({ request, ...event }) => {

  const { data: { articleCollection } } = await query<{
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

  const { data: { activityCollection } } = await query<{
      activityCollection: {
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
        activityCollection(limit: 300, preview: true) {
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

  const { data: { baladoCollection } } = await query<{
      baladoCollection: {
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
        baladoCollection(limit: 300, preview: true) {
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

  const { data: { themeCollection } } = await query<{
      themeCollection: {
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
        themeCollection(limit: 300, preview: true) {
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

  const items = [...articleCollection.items, ...activityCollection.items, ...baladoCollection.items, ...themeCollection.items]
    .filter(item => item.sys.id === "516e8c14-6303-43d0-9039-f5d72ead3ffe")
  const articles = [...articles1[0].body.posts, ...articles2[0].body.posts, ...articles3[0].body.posts]

  // console.log(items.length)
  // console.log(articles.length)

  for (let i = 0; i < items.length; i++) {
    const article = items[i]
    // const asset = (await environment.getAssets({ 'fields.title': article.titre })).items[0]
    const entry = await environment.getEntry(article.sys.id)
    console.log(article)
    // console.log(asset)

    if (entry) {
      const content = articles.find(a => a.id === article.sys.id)?.richContent
      // if (content) {
      //   console.log(i)
      //   const formatted = await Promise.all(content.nodes.map(node => formatContent(node, environment)));
      //   // console.log(JSON.stringify(formatted,null,2))
      //   await entry.patch([
      //     {
      //       op: 'replace',
      //       path: '/fields/intro/fr-CA',
      //       value: {
      //         nodeType: "document",
      //         data: {},
      //         content: formatted
      //       }
      //     }
      //   ])
      // }
      console.log(i)
      console.log(article)
      try {
        await entry.publish()  
      } catch (error) {
        console.error(error)
      }
    }

    // if (asset) {
    // await entry.patch([
    //   {
    //     op: 'replace',
    //     path: '/fields/media/fr-CA',
    //     value: { "sys": {        
    //       "id": asset.sys.id,        
    //       "linkType": "Asset",        
    //       "type": "Link" } }
    //   }
    // ])
    // }

    // await environment.update()
  }
 
  return {
    body: JSON.stringify(items, null, 2)
  }
}