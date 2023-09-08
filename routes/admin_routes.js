import { Router } from 'express';
import { services } from '../index.js';
const router = Router();

router.get('/dashboard', async (req, res) => {
	if (!req.session.role) {
		res.redirect('/');
	}

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
		{ text: 'Home', link: '/' },
		{ text: 'Waiters', link: `/${req.session.role}/waiters` },
		{ text: 'Log Out', link: '/logout' }
	]

	const user = {
		user_id: req.session.user_id,
		full_name: req.session.full_name,
		role: req.session.role
	}

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
		{ text: 'Home', link: '/' },
		{ text: 'Dashboard', link: `/${req.session.role}/dashboard` },
		{ text: 'Log Out', link: '/logout' }
	]

	const user = {
		user_id: req.session.user_id,
		full_name: req.session.full_name,
		role: req.session.role
	}

	res.render('waiters', {
		title: 'Waiters List',
		nav,
		user,
		waiters
	});
});

router.post('/waiters/add', async (req, res) => {
	res.redirect('/waiters/add');
});

router.post('/waiters/add', async (req, res) => {
	res.redirect('/waiters/add');
});

export default router;