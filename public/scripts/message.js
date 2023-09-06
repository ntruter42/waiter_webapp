window.addEventListener('load', () => {
	const time = 3000;

	setTimeout(() => {
		document.querySelector('.message').classList.add('fade-out');
	}, time);

	setTimeout(() => {
		document.querySelector('.message').classList.add('hidden');
	}, time + 900);
});