// src/utils/api.js - FRONTEND FILE (browser-safe)

const API_URL = '/api/chat';  // Relative URL, no imports needed

export const sendMessage = async (messages) => {
	try {
		const response = await fetch(API_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ messages }),
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data = await response.json();
		return data.response;
	} catch (error) {
		console.error('API Error:', error);
		return "Oops! My circuits got tangled 🤖 Try again in a moment!";
	}
};