import { services } from '../index.js';
import express from 'express';
const router = express.Router();

// redirect to login page if not logged in (ask Mokhele)

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
	const message = {
		text: req.flash('error')[0] || '',
		type: 'error'
	};

	res.render('login', {
		title: "Sign In",
		message
	});
});

router.post('/login', async (req, res) => {
	const username = req.body.username;
	const password = req.body.password;
	const user_data = await services.getUser(username, password);

	if (user_data) {
		req.session.uid = user_data.user_id || null;
		req.session.user = `${user_data.first_name} ${user_data.last_name}` || null;
		req.session.role = user_data.role || null;
	} else {
		req.flash('error', "The username or password entered is incorrect");
		req.session.role = null;
	}

	res.redirect('/');
});

router.post('/add/:day_id', async (req, res) => {
	await services.setDay(req.session.uid, req.params.day_id);

	res.redirect('/waiter/dashboard');
});

router.post('/remove/:day_id', async (req, res) => {
	await services.unsetDay(req.session.uid, req.params.day_id);

	res.redirect('/waiter/dashboard');
});

router.get('/admin/dashboard', async (req, res) => {
	const waiters = await services.getWaiters();
	const days = await services.getDays();
	const assignments = await services.getAssignments();

	days.forEach(day => {
		day.waiters = [];
		assignments.forEach(assignment => {
			if (assignment.day_id === day.day_id) {
				day.waiters.push(waiters.find(waiter => waiter.user_id === assignment.waiter_id));
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

	// TODO: clean up getWeek function
	// retrieved directly from StackOverflow user - alias51
	Date.prototype.getWeek = function () {
		var first = new Date(this.getFullYear(), 0, 1);
		var today = new Date(this.getFullYear(), this.getMonth(), this.getDate());
		var dayOfYear = ((today - first + 86400000) / 86400000);
		return Math.ceil(dayOfYear / 7)
	};

	res.render('admin', {
		title: 'Admin',
		admin: req.session.user,
		days,
		week: (new Date()).getWeek()
	});
});

router.get('/waiter/dashboard', async (req, res) => {
	const days = await services.getDays();
	const assignments = await services.getUserAssignments(req.session.uid);

	days.forEach(day => {
		day.status = '';
		day.action = 'add';
		assignments.forEach(assignment => {
			if (assignment.day_id === day.day_id) {
				day.status = 'booked';
				day.action = 'remove';
			}
		});

	});

	// TODO: clean up getWeek function
	// retrieved directly from StackOverflow user - alias51
	Date.prototype.getWeek = function () {
		var first = new Date(this.getFullYear(), 0, 1);
		var today = new Date(this.getFullYear(), this.getMonth(), this.getDate());
		var dayOfYear = ((today - first + 86400000) / 86400000);
		return Math.ceil(dayOfYear / 7)
	};

	res.render('waiter', {
		title: 'Waiter',
		waiter: req.session.user,
		days,
		week: (new Date()).getWeek()
	});
});

export default router;