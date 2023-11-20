import fs from 'node:fs/promises'

const databasePath = new URL('../db.json', import.meta.url)

export class Database {

  #database = {}

  constructor() {
    fs.readFile(databasePath, 'utf-8').then((data) => {
      this.#database = JSON.parse(data)
    })
    .catch(() => {
      this.#persist()
    })
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database))
  }

  insert(table, data) {
    if(Array.isArray(this.#database[table])) {
      this.#database[table].push(data)
    } else {
      this.#database[table] = [data]
    }

    this.#persist()
  }

  select(table, search) {
    let data = this.#database[table] ?? []

    if(search) {
      data = data.filter(row => {
        return Object.entries(search).some(([key, value]) => {
          return row[key].toLowerCase().includes(value)
        })
      })
    }

    return data
  }

  getTaskById(table, id) {
    const task = this.#database[table].find(row => row.id === id)

    return task
  }

  update(table, id, data) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id)

    if(rowIndex > -1) {
      const existingRow = this.#database[table][rowIndex];
      const updatedRow = {
        ...existingRow,
        ...data,
      };
  
      this.#database[table][rowIndex] = updatedRow;
      this.#persist();
    }
  }

  delete(table, id) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id)

    if(rowIndex > -1) {
      this.#database[table].splice(rowIndex, 1)
      this.#persist()
    }
  }

  completeTask(table, id) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id)

    if(rowIndex > -1) {
      let task = this.#database[table][rowIndex]
      task = { id, ...task, completed_at: new Date() }
      this.#database[table][rowIndex] = task;
      
      this.#persist()
    }
  }
}