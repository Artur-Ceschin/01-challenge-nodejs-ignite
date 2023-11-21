import { randomUUID } from 'node:crypto'
import { Database } from "./database.js";
import { buildRoutePath } from './utils/build-route-path.js'


const database = new Database()

const table = 'tasks'

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query

      const users = database.select(table, search ? {
        title: search,
        description: search
      } : null)

      return res.end(JSON.stringify(users))
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: ((req, res) => {
      const { title, description } = req.body

      if(title && description) {
        const tasks ={
          id: randomUUID(),
          title,
          description,
          completed_at: null,
          created_at: new Date(),
          updated_at: new Date()
        }
    
        database.insert(table, tasks)
      } else { 
        return res.writeHead(404).end('Description or title not provided')
      }
  
      return res.writeHead(201).end()
    })
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: ((req, res)  => {
      const { id } = req.params

      const { title, description } = req.body

      const updatedAt = {}

      if(title !== undefined) {
        updatedAt.title = title
      }

      if(description !== undefined) {
        updatedAt.description = description
      }

      database.update(table, id, {
        ...updatedAt,
        updated_at: new Date(),
      })

      return res.writeHead(204).end()
    })
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: ((req, res)  => {
      const { id } = req.params

      database.delete(table, id)

      return res.writeHead(204).end()
    })
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: ((req, res)  => {
      const { id } = req.params

      database.completeTask(table, id)

      return res.writeHead(204).end()
    })
  }
]