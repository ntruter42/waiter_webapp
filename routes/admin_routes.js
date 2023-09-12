import { Router } from 'express';
import { services } from '../index.js';
import { randomBytes } from 'crypto';
const router = Router();

router.get('/dashboard', async (req, res) => {
	if (!req.session.role) { res.redirect('/') }

	const assignments = await services.getAssignments('day_name, full_name');
	const days = [
		{ day_name: 'Monday' },
		{ day_name: 'Tuesday' },
		{ day_name: 'Wednesday' },
		{ day_name: 'Thursday' },
		{ day_name: 'Friday' },
		{ day_name: 'Saturday' },
		{ day_name: 'Sunday' }
	];

	days.forEach(day => {
		day.waiters = [];
		assignments.forEach(assignment => {
			if (assignment.day_name === day.day_name) {
				day.waiters.push(assignment.full_name);
			}
		})

		if (day.waiters.length === 3) {
			day.status = 'booked';
		} else if (day.waiters.length > 3) {
			day.status = 'overbooked';
		} else {
			day.status = 'underbooked';
		}
	});

	const nav = [
		{ text: 'Waiters', link: `/${req.session.role}/waiters` },
		{ text: 'Add User', link: '/admin/waiters/add' },
		{ text: 'Log Out', link: '/logout' }
	];

	const user = {
		user_id: req.session.user_id,
		full_name: req.session.full_name,
		role: req.session.role
	};

	res.render('dashboard', {
		title: 'Admin Dashboard',
		admin: true,
		nav,
		user,
		days,
		week: services.week()
	});
});

router.post('/reset', async (req, res) => {
	await services.resetAssignments();
	res.redirect('/admin/dashboard');
});

router.get('/waiters', async (req, res) => {
	const waiters = await services.getWaiters();

	const nav = [
		{ text: 'Dashboard', link: `/${req.session.role}/dashboard` },
		{ text: 'Add User', link: '/admin/waiters/add' },
		{ text: 'Log Out', link: '/logout' }
	];

	const user = {
		user_id: req.session.user_id,
		full_name: req.session.full_name,
		role: req.session.role
	};

	res.render('waiters', {
		title: 'Waiters List',
		nav,
		user,
		waiters
	});
});

router.get('/waiters/add', (req, res) => {
	const message = {
		text: req.flash('error')[0] || '',
		type: 'error'
	};

	const nav = [
		{ text: 'Dashboard', link: `/${req.session.role}/dashboard` },
		{ text: 'Waiters', link: '/admin/waiters' },
		{ text: 'Logout', link: '/logout' }
	]

	const user = {
		user_id: req.session.user_id,
		full_name: req.session.full_name,
		role: req.session.role
	}

	res.render('add', {
		title: "Create User",
		nav,
		user,
		message
	});
});

router.post('/waiters/add', async (req, res) => {
	const new_user = {
		username: req.body.username,
		full_name: req.body.full_name,
		role: req.body.role,
		password: req.body.password,
		salt: randomBytes(8).toString('hex')
	}
	const confirm = req.body.confirm_password;
	const user_data = await services.getUser(new_user.username);

	if (user_data) {
		req.flash('error', "The username already exists");
		res.redirect('/admin/waiters/add');
	} else if (new_user.password !== confirm) {
		req.flash('error', "Passwords don't match");
		res.redirect('/admin/waiters/add');
	} else {
		await services.addUser(new_user);
		res.redirect('/admin/waiters');
	}

});

export default router;