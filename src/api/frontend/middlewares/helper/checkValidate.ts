export async function checkValidate(token: string) {
  // @ts-ignore
  const entries = await strapi.documents('api::token.token').findMany({
    fields: ['token', 'level']
  })
  for(const entry of entries as any[]) {
    if(entry.token === token) return { state: true, level: entry.level }
  }
  return { state: false, level: -1 }
}
