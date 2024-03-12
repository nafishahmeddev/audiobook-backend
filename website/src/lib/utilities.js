export const format = (seconds) => {
	if (isNaN(seconds)) return '0:00';

	const minutes = Math.floor(seconds / 60);
	seconds = Math.floor(seconds % 60);
	if (seconds < 10) seconds = `0${seconds}`;

	return `${minutes}:${seconds}`;
};

export const siteURL = (path = "") => {
	return "https://audiobook.nafish.me/api/v1/mobile" + path;
}