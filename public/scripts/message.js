window.addEventListener('load', () => {
	const time = 3000;
	const message = document.querySelector('.message');

	if (message) {	
		setTimeout(() => {
			message.classList.add('fade-out');
		}, time);
		
		setTimeout(() => {
			message.classList.add('hidden');
		}, time + 900);
	}
});