export default () => {
	class User {
		constructor(username, full_name, role, password) {
			this.username = username;
			this.full_name = full_name;
			this.role = role;
			this.password = password;
		}
	}

	class Day {
		constructor(day) {
			this.day = day;
		}

		name() {
			const week = [
				'Monday',
				'Tuesday',
				'Wednesday',
				'Thursday',
				'Friday',
				'Saturday',
				'Sunday'
			];
			return week[this.day];
		}

		addWaiter(waiter) {
			if (!this.waiters) {
				this.waiters = [];
			}
			this.waiters.push(waiter);
		}
	}

	return {
		User,
		Day
	}
}