import assert from 'assert';
import Database from '../config/db_setup.js';
import waiter_services from '../services/waiter_services.js';
import { log } from 'console';

describe('Waiters Webapp', async function () {
	let services;
	const db = Database();

	beforeEach(async function () {
		services = waiter_services(db, 'test');
		// await services.resetAssignments();
		await services.removeUsers();
	});

	describe('getDays', function () {
		it('should get list of all 7 days of week as objects', async function () {
			try {
				const expected = [
					{ day_id: 1, day_name: 'Monday' },
					{ day_id: 2, day_name: 'Tuesday' },
					{ day_id: 3, day_name: 'Wednesday' },
					{ day_id: 4, day_name: 'Thursday' },
					{ day_id: 5, day_name: 'Friday' },
					{ day_id: 6, day_name: 'Saturday' },
					{ day_id: 7, day_name: 'Sunday' }
				];
				const result = await services.getDays();

				assert.deepEqual(expected, result);
			} catch (error) {
				throw error;
			}
		});

		it('should get object for a specific day by id', async function () {
			try {
				const expected = { day_id: 2, day_name: 'Tuesday' };
				const result = await services.getDay(2);

				assert.deepEqual(expected, result);
			} catch (error) {
				throw error;
			}
		});
	});

	describe('addUser, removeUser, getUsers, getWaiters', function () {
		it('should return empty array if no users are added', async function () {
			try {
				const expected = [];
				const result = await services.getUsers();

				assert.deepEqual(expected, result);
			} catch (error) {
				throw error;
			}
		});

		it('should return an array containing a single added user', async function () {
			try {
				const new_user = {
					username: 'emusk69',
					full_name: 'Elon Musk',
					role: 'waiter',
					password: await services.hash('tesla123')
				}
				await services.addUser(new_user);

				const expected = 1;
				const result = (await services.getUsers()).length;

				assert.equal(expected, result);
			} catch (error) {
				throw error;
			}
		});

		it('should return an array containing only waiters', async function () {
			try {
				const new_user_one = {
					username: 'ntruter42',
					full_name: 'Nicholas Truter',
					role: 'admin',
					password: await services.hash('codex123')
				}
				await services.addUser(new_user_one);

				const new_user_two = {
					username: 'emusk69',
					full_name: 'Elon Musk',
					role: 'waiter',
					password: await services.hash('tesla123')
				}
				await services.addUser(new_user_two);

				const expected1 = 1;
				const result1 = (await services.getWaiters()).length;

				const expected2 = 2;
				const result2 = (await services.getUsers()).length;

				assert.equal(expected1, result1);
				assert.equal(expected2, result2);
			} catch (error) {
				throw error;
			}
		});

		it('should be able to remove a user', async function () {
			try {
				const new_user_one = {
					username: 'ntruter42',
					full_name: 'Nicholas Truter',
					role: 'admin',
					password: await services.hash('codex123')
				}
				await services.addUser(new_user_one);

				const new_user_two = {
					username: 'emusk69',
					full_name: 'Elon Musk',
					role: 'waiter',
					password: await services.hash('tesla123')
				}
				const user_id_two = (await services.addUser(new_user_two)).user_id;

				const expected1 = 2;
				const result1 = (await services.getUsers()).length;

				await services.removeUser(user_id_two);

				const expected2 = 1;
				const result2 = (await services.getUsers()).length;

				assert.equal(expected1, result1);
				assert.equal(expected2, result2);
			} catch (error) {
				throw error;
			}
		});

		it('should return an array containing multiple added users', async function () {
			try {
				const new_users = [{
					username: 'emusk69',
					full_name: 'Elon Musk',
					role: 'waiter',
					password: 'tesla123'
				}, {
					username: 'jbezos007',
					full_name: 'Jeff Bezos',
					role: 'waiter',
					password: 'amazon123'
				}, {
					username: 'msuck404',
					full_name: 'Mark Zuckerberg',
					role: 'waiter',
					password: 'fakebook123'
				}];

				// TODO: find out why foreach does not work
				// new_users.forEach(async function (user) {
				// 	await services.addUser(user);
				// });

				for (let user of new_users) { await services.addUser(user) }

				const expected = 3;
				const result = (await services.getUsers()).length;

				assert.equal(expected, result);
			} catch (error) {
				throw error;
			}
		});
	});

	describe('setDay, unsetDay, getAssignments, isAssigned', function () {
		it('should set assignment for a waiter on a given day', async function () {
			const expected1 = false;
			const result1 = await services.isAssigned(1, 5);
			assert.equal(expected1, result1);

			const new_user = {
				username: 'emusk69',
				full_name: 'Elon Musk',
				role: 'waiter',
				password: await services.hash('tesla123')
			}
			await services.addUser(new_user);
			await services.setDay(1, 5);

			const expected2 = true;
			const result2 = await services.isAssigned(1, 5);
			assert.equal(expected2, result2);
		});

		it('should unset assignment for a waiter on a given day', async function () {
			const new_user = {
				username: 'emusk69',
				full_name: 'Elon Musk',
				role: 'waiter',
				password: await services.hash('tesla123')
			}
			await services.addUser(new_user);
			await services.setDay(1, 5);

			const expected1 = true;
			const result1 = await services.isAssigned(1, 5);
			assert.equal(expected1, result1);

			await services.unsetDay(1, 5);

			const expected2 = false;
			const result2 = await services.isAssigned(1, 5);
			assert.equal(expected2, result2);
		});

it('should get assignments for all waiters on all days from all tables', async function () {
	const new_user_one = {
		username: 'emusk69',
		full_name: 'Elon Musk',
		role: 'waiter',
		password: await services.hash('tesla123')
	}
	await services.addUser(new_user_one);
	await services.setDay(1, 1);
	await services.setDay(1, 5);

	const new_user_two = {
		username: 'lsu42',
		full_name: 'Lisa Su',
		role: 'waiter',
		password: await services.hash('amd123')
	}
	await services.addUser(new_user_two);
	await services.setDay(2, 1);

	const expected = [{
		user_id: 1,
		day_id: 1,
		day_name: 'Monday',
		username: 'emusk69',
		full_name: 'Elon Musk',
		role: 'waiter'
	}, {
		user_id: 1,
		day_id: 5,
		day_name: 'Friday',
		username: 'emusk69',
		full_name: 'Elon Musk',
		role: 'waiter'
	}, {
		user_id: 2,
		day_id: 1,
		day_name: 'Monday',
		username: 'lsu42',
		full_name: 'Lisa Su',
		role: 'waiter'
	}];
	const result = await services.getAssignments();
	assert.deepEqual(expected, result);
});
	});

	// describe('', function () {
	// 	it('', async function () {

	// 	});
	// });

});