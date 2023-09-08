import { Router } from 'express';
const router = Router();

router.get('/dashboard', (req, res) => {
	req.flash('error', "Sign in to view dashboard");
	res.redirect('/');
})

router.get('/waiters', (req, res) => {
	req.flash('error', "Sign in to add waiters");
	res.redirect('/');
})

export default router;