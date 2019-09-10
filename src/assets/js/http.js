import flyio from 'flyio'
import 'babel-polyfill'

const APIS = {
  update: {
    method: 'POST',
    url: '/update'
  },
  delete: {
    method: 'POST',
    url: '/delete'
  },
  insert: {
    method: 'POST',
    url: '/insert'
  },
  list: {
    method: 'GET',
    url: '/list'
  },
  uploads: {
    method: 'POST',
    url: '/uploads'
  }
}

flyio.config.baseURL = location.host.includes('localhost') ? 'http://localhost:8088' : 'http://118.190.53.117:8088'
// flyio.config.withCredentials = true
flyio.config.timeout = 100000
flyio.config.responseType = 'json'

flyio.interceptors.request.use(config => {
  let contentType = 'application/json'
  // if (config.method === 'POST') contentType = 'application/x-www-form-urlencoded'
  config.headers['Content-Type'] = contentType
  // config.headers['Session'] = 'pkfkurqfnteycjagywyfkuxikqbqrcfd'
  return config
},
error => {
  return Promise.reject(error)
})

flyio.interceptors.response.use(
  response => {
    return response
  },
  error => {
    return Promise.reject(error)
  }
)

export function fetch (options) {
  if (options.constructor !== Object) throw 'fetch options must be object!'
  if (!options.api && !options.url) throw 'fetch options have no api or url!'

  return new Promise((resolve, reject) => {
    const method = !options.url ? APIS[options.api].method : options.method
    const url = !options.url ? APIS[options.api].url : options.url
    if (!method) throw 'fetch options have no method!'

    flyio[method.toLowerCase()](url, options.params, options.configs)
      .then(response => {
        resolve(response.data)
      }, err => {
        reject(err)
      })
  })
}