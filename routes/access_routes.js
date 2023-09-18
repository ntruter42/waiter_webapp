import { Router } from 'express';
import { services } from '../index.js';
const router = Router();

router.get('/', (req, res) => {
	if (req.session.role) {
		res.redirect(`/${req.session.role}/dashboard`);
	} else {
		res.redirect('/login');
	}
});

router.get('/login', async (req, res) => {
	const nav = [
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
	const user = await services.getUser(req.body.username);

	if (user && await services.verify(req.body.password, user.password)) {
		req.session.user_id = user.user_id;
		req.session.full_name = user.full_name;
		req.session.role = user.role;
	} else {
		req.flash('error', "The username or password entered is incorrect");
	}

	res.redirect('/');
});

router.get('/logout', async (req, res) => {
	req.session.destroy(() => {
		res.redirect('/login');
	});
});

export default router;