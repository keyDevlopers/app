import { mapEnvironment } from '@utils/checkEnvironment'
import axios from 'axios'
import chalk from 'chalk'
import Constants from 'expo-constants'
import * as Sentry from 'sentry-expo'

const ctx = new chalk.Instance({ level: 3 })

export type Params = {
  method: 'get' | 'post' | 'put' | 'delete'
  url: string
  params?: {
    [key: string]: string | number | boolean | string[] | number[] | boolean[]
  }
  headers?: { [key: string]: string }
  body?: FormData | Object
  sentry?: boolean
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
  body,
  sentry = true
}: Params): Promise<{ body: T }> => {
  console.log(
    ctx.bgGreen.bold(' API tooot ') +
      ' ' +
      method +
      ctx.green(' -> ') +
      `/${url}` +
      (params ? ctx.green(' -> ') : ''),
    params ? params : ''
  )

  return axios({
    timeout: method === 'post' ? 1000 * 60 : 1000 * 15,
    method,
    baseURL: `https://${TOOOT_API_DOMAIN}/`,
    url: `${url}`,
    params,
    headers: {
      'Content-Type':
        body && body instanceof FormData
          ? 'multipart/form-data'
          : 'application/json',
      'User-Agent': `tooot/${Constants.manifest?.version}`,
      Accept: '*/*',
      ...headers
    },
    ...(body && { data: body }),
    validateStatus: status =>
      url.includes('translate') ? status < 500 : status === 200
  })
    .then(response => {
      return Promise.resolve({
        body: response.data
      })
    })
    .catch(error => {
      if (sentry) {
        Sentry.Native.setExtras({
          API: 'tooot',
          ...(error?.response && { response: error.response }),
          ...(error?.request && { request: error.request })
        })
        Sentry.Native.captureException(error)
      }

      if (error?.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error(
          ctx.bold(' API tooot '),
          ctx.bold('response'),
          error.response.status,
          error.response.data.error
        )
        return Promise.reject({
          status: error?.response.status,
          message: error?.response.data.error
        })
      } else if (error?.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.error(
          ctx.bold(' API tooot '),
          ctx.bold('request'),
          error.request
        )
        return Promise.reject()
      } else {
        console.error(
          ctx.bold(' API tooot '),
          ctx.bold('internal'),
          error?.message,
          url
        )
        return Promise.reject()
      }
    })
}

export default apiTooot
