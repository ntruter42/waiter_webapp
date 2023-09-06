import express from "express";
import { engine } from "express-handlebars";
import bodyParser from "body-parser";
import session from "express-session";
import flash from "express-flash";

import database_config from './config/db_setup.js';
import waiter_models from "./models/waiter_models.js";
import waiter_services from "./services/waiter_services.js";
import waiter_routes from './routes/waiter_routes.js';

const app = express();

// FRONTEND MIDDLEWARE
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(flash());
app.use(session({
	secret: "secret42",
	resave: false,
	saveUninitialized: true,
	cookie: { maxAge: 3600000 }
}));
app.engine('handlebars', engine({
	defaultLayout: 'main',
	viewPath: './views',
	layoutsDir: './views/layouts'
}));
app.set('view engine', 'handlebars');

// INSTANCES
const db = database_config();
const models = waiter_models();
const services = waiter_services(db, process.env.NODE_ENV);

// ROUTES
app.use('/', waiter_routes);

export { services };

// PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
	console.log(`App started on PORT: ${PORT}`);
});