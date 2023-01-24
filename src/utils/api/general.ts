import axios from 'axios'
import { ctx, handleError, PagedResponse, parseHeaderLinks, processBody, userAgent } from './helpers'

export type Params = {
  method: 'get' | 'post' | 'put' | 'delete'
  domain: string
  url: string
  params?: {
    [key: string]: string | number | boolean | string[] | number[] | boolean[]
  }
  headers?: { [key: string]: string }
  body?: FormData | Object
}

const apiGeneral = async <T = unknown>({
  method,
  domain,
  url,
  params,
  headers,
  body
}: Params): Promise<PagedResponse<T>> => {
  console.log(
    ctx.bgMagenta.bold(' General ') +
      ' ' +
      domain +
      ' ' +
      method +
      ctx.magenta(' -> ') +
      `/${url}` +
      (params ? ctx.magenta(' -> ') : ''),
    params ? params : ''
  )

  return axios({
    timeout: method === 'post' ? 1000 * 60 : 1000 * 15,
    method,
    baseURL: `https://${domain}/`,
    url,
    params,
    headers: {
      Accept: 'application/json',
      ...userAgent,
      ...headers
    },
    data: processBody(body)
  })
    .then(response => ({ body: response.data, links: parseHeaderLinks(response.headers.link) }))
    .catch(handleError())
}

export default apiGeneral
