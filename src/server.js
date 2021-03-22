const knex = require('knex')
const app = require('./app')
const { PORT, DATABASE_URL } = require('./config')

const db = knex({
  client: 'pg',
  connection: DATABASE_URL,
  password: '/CW~)46h9D\kbT#',
  ssl=true,
  sslfactory=org.postgresql.ssl.NonValidatingFactory,
  sslmode = require
})

app.set('db', db)

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})