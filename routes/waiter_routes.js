import session from 'express-session';
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

	const nav = [{
		text: 'Home',
		link: '/'
	}, {
		text: 'Dashboard',
		link: `/${req.session.role}/dashboard`
	}, {
		text: 'Sign Up',
		link: '/signup'
	}]

	const curr_user = {
		id: req.session.uid,
		name: req.session.user,
		role: req.session.role
	}

	res.render('login', {
		title: "Sign In",
		nav,
		curr_user,
		message
	});
});

router.post('/login', async (req, res) => {
	const username = req.body.username;
	const password = req.body.password;
	const user_data = await services.getUser(username, password);

	if (user_data) {
		req.session.uid = user_data.user_id;
		req.session.user = `${user_data.first_name} ${user_data.last_name}`;
		req.session.role = user_data.role;
	} else {
		req.flash('error', "The username or password entered is incorrect");
		req.session.role = null;
	}

	res.redirect('/');
});

router.get('/signup', (req, res) => {
	const message = {
		text: req.flash('error')[0] || '',
		type: 'error'
	};

	const nav = [{
		text: 'Home',
		link: '/'
	}, {
		text: 'Dashboard',
		link: `/${req.session.role}/dashboard`
	}, {
		text: 'Sign In',
		link: '/login'
	}]

	const curr_user = {
		id: req.session.uid,
		name: req.session.user,
		role: req.session.role
	}

	res.render('signup', {
		title: "Sign Up",
		nav,
		curr_user,
		message
	});
});

router.post('/signup', async (req, res) => {
	const new_user = {
		username: req.body.username,
		first_name: req.body.first_name,
		last_name: req.body.last_name,
		role: req.body.role,
		password: req.body.password,
		salt: 123
	}
	const confirm = req.body.confirm_password;
	const user_data = await services.getUser(new_user.username);

	if (user_data) {
		req.flash('error', "The username already exists");
		req.session.role = null;
		res.redirect('/signup');
	} else if (new_user.password !== confirm) {
		req.flash('error', "Passwords don't match");
		req.session.role = null;
		res.redirect('/signup');
	} else {
		await services.addUser(new_user);
		res.redirect('/');
	}
});

router.get('/logout', async (req, res) => {
	req.session.uid = null;
	req.session.user = null;
	req.session.role = null;

	res.redirect('/');
});

router.post('/logout', async (req, res) => {
	res.redirect('/');
});

router.post('/set/:day_id', async (req, res) => {
	await services.setDay(req.session.uid, req.params.day_id);
	res.redirect('/waiter/dashboard');
});

router.post('/unset/:day_id', async (req, res) => {
	await services.unsetDay(req.session.uid, req.params.day_id);
	res.redirect('/waiter/dashboard');
});

router.get('/admin/dashboard', async (req, res) => {
	if (!req.session.role) {
		res.redirect('/login');
	}

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

	const nav = [{
		text: 'Home',
		link: '/'
	}, {
		text: 'Dashboard',
		link: `/${req.session.role}/dashboard`
	}, {
		text: 'Log Out',
		link: '/logout'
	}]

	const curr_user = {
		id: req.session.uid,
		name: req.session.user,
		role: req.session.role
	}

	res.render('admin', {
		title: 'Admin Dashboard',
		nav,
		curr_user,
		days,
		week: (new Date()).getWeek()
	});
});

router.get('/waiter/dashboard', async (req, res) => {
	if (!req.session.role) {
		res.redirect('/login');
	}

	const days = await services.getDays();
	const assignments = await services.getUserAssignments(req.session.uid);

	days.forEach(day => {
		day.status = '';
		day.action = 'set';
		assignments.forEach(assignment => {
			if (assignment.day_id === day.day_id) {
				day.status = 'booked';
				day.action = 'unset';
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

	const nav = [{
		text: 'Home',
		link: '/'
	}, {
		text: 'Dashboard',
		link: `/${req.session.role}/dashboard`
	}, {
		text: 'Log Out',
		link: '/logout'
	}]

	const curr_user = {
		id: req.session.uid,
		name: req.session.user,
		role: req.session.role
	}

	res.render('waiter', {
		title: 'Waiter Dashboard',
		nav,
		curr_user,
		days,
		week: (new Date()).getWeek()
	});
});

router.get('/undefined/dashboard', async (req, res) => {
	req.flash('error', "Login to view your dashboard");

	res.redirect('/login');
});

export default router;