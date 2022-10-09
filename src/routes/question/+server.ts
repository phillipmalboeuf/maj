import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

export let POST: RequestHandler = async ({ request }) => {
  const data = await request.formData()

  return json({
  question: data.get('question') as string
})
}