window.addEventListener('load', () => {
	const reset = document.querySelector('button[name="reset"]');

	if (reset) {
		reset.addEventListener('click', (event) => {
			if (!window.confirm("Are you sure you want to reset?")) {
				event.preventDefault();
			}
		});
	}
});