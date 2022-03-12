export async function query<T = any>(fetch, query: string, variables?: {[key:string]: any}, preview?: boolean): Promise<{ data: T, errors: { message: string }[] }> {
  const res = await fetch(
    'https://graphql.contentful.com/content/v1/spaces/hlfxtjh4lx5k/environments/master', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': preview ? 'Bearer H4izNXJg3Ft_xk6k_ZkkHJX4gxx3xjOogI8XncfGtbk' : 'Bearer ET07CJ_Aj0HCaZSfk4YxzmvB1VprODiyH795YMC51Ws'
    },
    body: JSON.stringify({
      query,
      variables
    })
  })

  const json = await res.json()
  console.log(json)
  return json
}