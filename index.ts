import path from 'path'
import dotenv from 'dotenv'
dotenv.config()
import express, {Express, Request, Response} from 'express'
import * as database from './config/database-config'
import routerAdmin from './routers/admin/index-route'
import routerClient from './routers/client/index-route'
import methodOverride from 'method-override'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import flash from 'connect-flash'

const app: Express = express()
const port: number | string = process.env.PORT || 3000
const projectRoot = path.basename(__dirname) === 'dist'
  ? path.resolve(__dirname, '..')
  : path.resolve(__dirname)

// Middleware to parse JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Template engine
app.set('views', path.join(projectRoot, 'views'))
app.set('view engine', 'pug')

// Static files
app.use(express.static(path.join(projectRoot, 'public')));
//method override
app.use(methodOverride('_method'));
//cookie parser
app.use(cookieParser());
app.use(session({ secret: process.env.SESSION_SECRET || 'music-app-session-secret', resave: false, saveUninitialized: false, cookie: { maxAge: 24 * 60 * 60 * 1000 } }));
app.use(flash());
app.use(async (_req, _res, next) => {
  try {
    await database.connect();
    next();
  } catch (error) {
    next(error);
  }
});
//route
routerAdmin(app);
routerClient(app);

export default app

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
}