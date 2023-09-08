export default () => {
	class Waiter {
		constructor(username) {
			this.username = username;
		}
	}

	class Day {
		constructor(day) {
			this.day = week[day];
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
		Day,
		Waiter
	}
}