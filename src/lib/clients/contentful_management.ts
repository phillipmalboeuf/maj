import { createClient } from 'contentful-management'

export const cma = createClient({
  accessToken: import.meta.env.VITE_CMA_TOKEN as string
})