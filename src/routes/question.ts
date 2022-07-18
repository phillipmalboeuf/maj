import type { RequestHandler } from '@sveltejs/kit';

export let POST: RequestHandler = async ({ request }) => {
  const data = await request.formData()

  return {
    body: {
      question: data.get('question') as string
    }
  }
}