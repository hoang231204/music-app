import express, {Express, Request, Response} from 'express'
import dotenv from 'dotenv'
import * as database from './config/database-config'
import routerAdmin from './routers/admin/index-route'
dotenv.config()
const app: Express = express()
const port: number | string = process.env.PORT || 3000
// Connect to the database
database.connect()
// Middleware to parse JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//template engine
app.set('views', `${__dirname}/views`)
app.set('view engine', 'pug')
//static file
app.use(express.static(`${__dirname}/public`));
//route
routerAdmin(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})