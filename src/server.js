const knex = require('knex')
const app = require('./app')
const { PORT } = require('./config')

const db = knex({
  client: 'pg',
  connection: {
      host : '5432',
      user: user,
      database : 'databasename',
      password : process.env.password,
      database : 'myapp_test',    
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