import { cma } from '$lib/clients/contentful_management'
import type { RequestHandler } from '@sveltejs/kit'
import slugify from 'slugify'

import posts1 from '$lib/posts1.json'
import posts2 from '$lib/posts2.json'
import posts3 from '$lib/posts3.json'


export const get: RequestHandler<{ titre: string }, {}> = async ({ request, ...event }) => {

  const posts = [...posts1[0].body.posts, ...posts2[0].body.posts, ...posts3[0].body.posts]

  // let personnes = posts.reduce((ps, post) => {
  //   return {
  //     ...ps,
  //     [post.memberId]: false
  //   }
  // }, {})
  // Object.keys(personnes).forEach(memberId => ({

  // }))


  return {
    body: JSON.stringify(posts.filter(post => post.title.includes('thème')).map(post => ({
      title: post.title,
      id: post.slug,
      media: post.coverMedia.image?.url,
      date: post.lastPublishedDatem,
      locale: post.language,
      // personne: post.memberId
    })), null, 2)
  }
}