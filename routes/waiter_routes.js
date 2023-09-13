import { Router } from 'express';
import { services } from '../index.js';
const router = Router();

router.get('/dashboard', async (req, res) => {
	if (!req.session.role) { res.redirect('/') }

	const assignments = await services.getAssignments('day_name, full_name');
	const days = [
		{ day_name: 'Monday', day_id: 1 },
		{ day_name: 'Tuesday', day_id: 2 },
		{ day_name: 'Wednesday', day_id: 3 },
		{ day_name: 'Thursday', day_id: 4 },
		{ day_name: 'Friday', day_id: 5 },
		{ day_name: 'Saturday', day_id: 6 },
		{ day_name: 'Sunday', day_id: 7 }
	];

	days.forEach(day => {
		day.status = '';
		day.action = 'set';
		day.count = 0;

		assignments.forEach(assignment => {
			if (assignment.day_name === day.day_name) {
				day.count += 1;

				if (assignment.full_name === req.session.full_name) {
					day.status = 'booked';
					day.action = 'unset';
				}
			}

		});
	});

	if (days.filter(day => day.status === 'booked').length >= 5) {
		days.forEach(day => {
			if (day.action === 'set') { day.action = 'lock' }
		});
	}

	days.forEach(day => {
		if (day.count >= 6 && day.action === 'set') {
			day.status = 'overbooked';
			day.action = 'full';
		}
	});

	const nav = [
		{ text: 'Home', link: '/' },
		{ text: 'Log Out', link: '/logout' }
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

	res.render('dashboard', {
		title: 'Waiter Dashboard',
		waiter: true,
		nav,
		user,
		message: message.text ? message : null,
		days,
		week: services.week()
	});
});

router.post('/set/:day_id', async (req, res) => {
	await services.setDay(req.session.user_id, req.params.day_id);
	res.redirect('/waiter/dashboard');
});

router.post('/unset/:day_id', async (req, res) => {
	await services.unsetDay(req.session.user_id, req.params.day_id);
	res.redirect('/waiter/dashboard');
});

router.post('/lock/:day_id', async (req, res) => {
	req.flash('error', "You cannot set more than 5 days");
	res.redirect('/waiter/dashboard');
});

router.post('/full/:day_id', async (req, res) => {
	const day = await services.getDay(req.params.day_id);
	req.flash('error', `${day.day_name} is already fully booked`);
	res.redirect('/waiter/dashboard');
});

export default router;