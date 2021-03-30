const knex = require('knex')
const app = require('./app')
const { PORT } = require('./config')

const db = knex({
  client: 'pg',
  connection: {
      host : 'ec2-18-233-83-165.compute-1.amazonaws.com',
      user: 'zkwnrvbuimcdel',
      database : 'd3qj30j6aiscv',
      password : '3ba026693655b972b960d98011aa6cf586edafd4478c834a229722864f4e4e80',
      ssl: { 
        rejectUnauthorized: false 
      }
    }
})

app.set('db', db)

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})