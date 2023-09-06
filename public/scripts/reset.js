document.querySelector('button[name = "reset"]').addEventListener('click', (event) => {
	if (!window.confirm("Start new availability schedule?")) {
		event.preventDefault();
	}
});