import { mapEnvironment } from '@utils/helpers/checkEnvironment'
import axios from 'axios'
import { ctx, handleError, processBody, userAgent } from './helpers'

export type Params = {
  method: 'get' | 'post' | 'put' | 'delete'
  url: string
  params?: {
    [key: string]: string | number | boolean | string[] | number[] | boolean[]
  }
  headers?: { [key: string]: string }
  body?: FormData | Object
}

export const TOOOT_API_DOMAIN = mapEnvironment({
  release: 'api.tooot.app',
  candidate: 'api-candidate.tooot.app',
  development: 'api-development.tooot.app'
})

const apiTooot = async <T = unknown>({
  method,
  url,
  params,
  headers,
  body
}: Params): Promise<{ body: T }> => {
  console.log(
    ctx.bgGreen.bold(' tooot ') +
      ' ' +
      method +
      ctx.green(' -> ') +
      `/${url}` +
      (params ? ctx.green(' -> ') : ''),
    params ? params : ''
  )

  return axios({
    timeout: method === 'post' ? 1000 * 60 : 1000 * 30,
    method,
    baseURL: `https://${TOOOT_API_DOMAIN}/`,
    url: `${url}`,
    params,
    headers: {
      Accept: 'application/json',
      ...userAgent,
      ...headers
    },
    data: processBody(body)
  })
    .then(response => {
      return Promise.resolve({
        body: response.data
      })
    })
    .catch(
      handleError({
        message: 'API error',
        captureRequest: { url, params, body },
        captureResponse: true
      })
    )
}

export default apiTooot
