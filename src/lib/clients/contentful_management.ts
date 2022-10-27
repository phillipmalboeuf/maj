import pkg from 'contentful-management'
const { createClient } = pkg

export const cma = createClient({
  accessToken: import.meta.env.VITE_CMA_TOKEN as string
})