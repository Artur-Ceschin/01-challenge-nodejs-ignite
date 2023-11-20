import http from 'node:http'
import { json } from './middlewares/json.js'
import { routes } from './routes.js'
import { extractQueryParams } from './utils/extract-query-params.js'
import { getTaskById } from './middlewares/getTask.js'


const server = http.createServer(async (req, res) => {
  const {method, url} = req

  await json(req, res)

  const route = routes.find(route => {
    return route.method === method && route.path.test(url)
  })

  if(route) {
    const routeParams = req.url.match(route.path)

    
    const { query, ...params } = routeParams.groups
    
    req.params = params
    req.query = query ? extractQueryParams(query) : {}

    if (req.params.id) {
      return getTaskById(req, res, () => route.handler(req, res));
    }

    return route.handler(req, res)
  }

  return res.writeHead(404).end()
})

const port = 4000

server.listen(port, () => {
  console.log(`Port is running on port ${port} 🚀`)
})