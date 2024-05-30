import { useEffect, useState } from 'react';

export function Timer() {
	const [seconds, setSeconds] = useState(0);
	const color = getColor(seconds);

	useEffect(() => {
		const interval = setInterval(() => {
			setSeconds((prev) => prev + 1);
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	}, []);

	const formatted = new Date(1000 * seconds).toISOString().substring(14, 19);

	return (
		<span style={{ color, fontSize: '25px', fontWeight: 'bold' }}>
			{formatted}
		</span>
	);
}

function getColor(seconds) {
	if (seconds < 10) {
		return '#000';
	}

	if (seconds < 15) {
		return 'green';
	}

	return 'red';
}
