import { Router } from 'express';
import { services } from '../index.js';
const router = Router();

router.get('/dashboard', async (req, res) => {
	if (!req.session.role) { res.redirect('/') }
	else {
		const assignments = await services.getAssignments('day_name, user_id, full_name');
		const waiters = await services.getWaiters();
		const days = [
			{ day_id: 1, day_name: 'Monday' },
			{ day_id: 2, day_name: 'Tuesday' },
			{ day_id: 3, day_name: 'Wednesday' },
			{ day_id: 4, day_name: 'Thursday' },
			{ day_id: 5, day_name: 'Friday' },
			{ day_id: 6, day_name: 'Saturday' },
			{ day_id: 7, day_name: 'Sunday' }
		];

		days.forEach(day => {
			day.waiters = [];
			assignments.forEach(assignment => {
				if (assignment.day_name === day.day_name) {
					day.waiters.push({ full_name: assignment.full_name, user_id: assignment.user_id });
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

		const message = {
			text: req.flash('error')[0] || '',
			type: 'error'
		};

		const assign_message = {
			text: req.flash('assign_error')[0] || '',
			type: 'warning'
		};

		res.render('dashboard', {
			title: 'Dashboard',
			admin: true,
			nav,
			user,
			message,
			//
			assign_message,
			waiters,
			days,
			week: services.week()
		});
	}
});

router.post('/assign', (req, res) => {
	req.flash('assign_error', "This feature is not available yet");
	res.redirect('/admin/dashboard');
});

router.post('/reset', async (req, res) => {
	await services.resetAssignments();
	res.redirect('/admin/dashboard');
});

router.get('/waiters', async (req, res) => {
	if (!req.session.role) { res.redirect('/') }
	else {
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

		const message = {
			text: req.flash('success')[0] || '',
			type: 'success'
		};

		res.render('waiters', {
			title: 'Waiters List',
			nav,
			user,
			message,
			//
			waiters
		});
	}
});

router.get('/waiters/add', (req, res) => {
	if (!req.session.role) { res.redirect('/') }
	else {
		const form_data = {
			full_name: (req.flash('form_full_name')[0] || ''),
			username: (req.flash('form_username')[0] || ''),
			password: (req.flash('form_password')[0] || '')
		}

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

		const message = {
			text: req.flash('error')[0] || '',
			type: 'error'
		};

		res.render('add', {
			title: "Create User",
			nav,
			user,
			message,
			form_data
		});
	}
});

router.post('/waiters/add', async (req, res) => {
	if (!req.session.role) { res.redirect('/') }

	if (req.body.password !== req.body.confirm_password) {
		req.flash('error', "Passwords don't match");
		req.flash('form_full_name', req.body.full_name);
		req.flash('form_username', req.body.username);
		res.redirect('/admin/waiters/add');
	} else if (await services.getUser(req.body.username)) {
		req.flash('error', "The username already exists");
		req.flash('form_full_name', req.body.full_name);
		req.flash('form_password', req.body.password);
		res.redirect('/admin/waiters/add');
	} else {
		const new_user = {
			username: req.body.username,
			full_name: req.body.full_name,
			role: req.body.role,
			password: req.body.password
		}

		await services.addUser(new_user);
		req.flash('success', `${new_user.full_name} successfully added to roster`);
		res.redirect('/admin/waiters');
	}
});

router.post('/waiters/remove/:user_id', async (req, res) => {
	const waiter = (await services.getWaiter(req.params.user_id))[0];

	await services.removeUser(req.params.user_id);
	req.flash('success', `${waiter.full_name} successfully removed from roster`);
	res.redirect('/admin/waiters');
});

router.get('/unset/:day_id/:user_id', async (req, res) => {
	await services.unsetDay(req.params.user_id, req.params.day_id);
	res.redirect('/admin/dashboard');
});

export default router;