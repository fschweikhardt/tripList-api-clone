const knex = require('knex')
const app = require('./app')
const { PORT, DATABASE_URL } = require('./config')

// const db = knex({
//   client: 'pg',
//   connection: process.env.DATABASE_URL,
//   ssl: false
// })

const db = knex({
  client: 'pg',
  connection: {
    connectionString: DATABASE_URL,
    ssl:{
      rejectUnauthorized: false
    }
  }
})

// var knex = require('knex')({
//   client: 'pg',
//   connection: {
//     host : '5432',
//     user: user,
//     database : 'databasename',
       password : process.env.password,
//     database : 'myapp_test',
//     ssl: true
//   }
// });

app.set('db', db)

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})