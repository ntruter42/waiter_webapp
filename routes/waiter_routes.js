import { services } from '../index.js';
import express from 'express';
const router = express.Router();

router.get('/', (req, res, next) => {
	if (req.session.role === 'admin') {
		res.redirect('/admin/dashboard');
	} else if (req.session.role === 'waiter') {
		res.redirect('/waiter/dashboard');
	} else {
		next();
	}
}, (req, res) => {
	res.redirect('/login');
});

router.get('/login', (req, res) => {
	res.render('login', {
		title: "Sign In"
	});
});

router.post('/login', async (req, res) => {
	const username = req.body.username;
	const password = req.body.password;
	const user_data = await services.getUserData(username, password);

	req.session.uid = user_data.user_id || null;
	req.session.user = user_data.first_name || null;
	req.session.role = user_data.role || null;

	res.redirect('/');
});

router.get('/admin/dashboard', (req, res) => {
	res.render('admin');
});

router.get('/waiter/dashboard', (req, res) => {
	res.render('waiter');
});

export default router;