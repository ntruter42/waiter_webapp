import express from "express";
import { engine } from "express-handlebars";
import bodyParser from "body-parser";
import session from "express-session";
import flash from "express-flash";
import "dotenv/config";

import db_config from './config/db_setup.js';
import db_services from "./services/waiter_services.js";
import waiter_models from "./models/waiter_models.js";

import access_routes from './routes/access_routes.js';
import admin_routes from './routes/admin_routes.js';
import waiter_routes from './routes/waiter_routes.js';
import error_routes from './routes/error_routes.js';

const app = express();

// FRONTEND MIDDLEWARE
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(flash());
app.use(session({
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: false,
	cookie: {}
}));
app.engine('handlebars', engine({
	defaultLayout: 'main',
	viewPath: './views',
	layoutsDir: './views/layouts'
}));
app.set('view engine', 'handlebars');

// INSTANCES
const db = db_config();
const models = waiter_models();
const services = db_services(db, process.env.NODE_ENV);

// ROUTES
app.use('/', access_routes);
app.use('/waiter', waiter_routes);
app.use('/admin', admin_routes);
app.use('/undefined', error_routes);
app.use('/null', error_routes);

export { services };

// PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
	console.log(`App started on PORT: ${PORT}`);
});