import { Router } from 'express';
import { services } from '../index.js';
const router = Router();

router.get('/', (req, res, next) => {
	if (req.session.role === 'admin') {
		res.redirect('/admin/dashboard');
	} else if (req.session.role === 'waiter') {
		res.redirect('/waiter/dashboard');
	} else {
		res.redirect('/login');
	}
});

router.get('/login', async (req, res) => {
	const nav = [
		{ text: 'Home', link: '/' },
		{ text: 'Dashboard', link: `/${req.session.role}/dashboard` }
	];

	const user = {
		user_id: req.session.user_id,
		full_name: req.session.full_name,
		role: req.session.role
	}

	const message = {
		text: req.flash('error')[0] || null,
		type: 'error'
	};

	res.render('login', {
		title: "Sign In",
		nav,
		user,
		message: message.text ? message : null
	});
});

router.post('/login', async (req, res) => {
	const username = req.body.username;
	const password = req.body.password;
	const user = await services.getUser(username, password);

	if (user) {
		req.session.user_id = user.user_id;
		req.session.full_name = user.full_name;
		req.session.role = user.role;
	} else {
		req.flash('error', "The username or password entered is incorrect");
		req.session.role = undefined;
	}

	res.redirect('/');
});

router.get('/logout', async (req, res) => {
	req.session.destroy(() => {
		res.redirect('/login');
	});
});

export default router;