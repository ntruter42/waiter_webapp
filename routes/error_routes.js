import { Router } from 'express';
const router = Router();

router.get('/dashboard', (req, res) => {
	req.flash('error', "Sign in to view dashboard");
	res.redirect('/');
})

router.get('/waiters', (req, res) => {
	res.redirect('/');
})

router.get('/waiters/add', (req, res) => {
	res.redirect('/');
})

router.get('/waiters/unset/:day_id/:user_id', (req, res) => {
	res.redirect('/');
})

export default router;