function confirmPassword(event) {
	const password = document.getElementById("password").value;
	const confirm_password = document.getElementById("confirm_password").value;

	setTimeout(() => {
		alert("Passwords do not match.");
	}, 100);

	if (password !== confirm_password) {
		event.preventDefault();
		return false;
	}
}