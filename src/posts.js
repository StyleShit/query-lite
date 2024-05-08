const posts = {
	1: {
		id: 1,
		title: 'How to use React Query',
		body: 'sunt aut facere repellat provident occaecati excepturi optio reprehenderit quia et suscipit suscipit recusandae consequuntur expedita et cum reprehenderit molestiae ut ut quas totam nostrum rerum est autem sunt rem eveniet architecto',
	},

	2: {
		id: 2,
		title: 'Help me Copilot, I need a mock post title!',
		body: 'sunt aut facere repellat provident occaecati excepturi optio reprehenderit quia et suscipit suscipit recusandae consequuntur expedita et cum reprehenderit molestiae ut ut quas totam nostrum rerum est autem sunt rem eveniet architecto',
	},

	3: {
		id: 3,
		title: 'Why are you generating the same post title again?',
		body: 'sunt aut facere repellat provident occaecati excepturi optio reprehenderit quia et suscipit suscipit recusandae consequuntur expedita et cum reprehenderit molestiae ut ut quas totam nostrum rerum est autem sunt rem eveniet architecto',
	},

	4: {
		id: 4,
		title: 'StyeShit is the best developer in the world, follow him on GitHub!',
		body: 'sunt aut facere repellat provident occaecati excepturi optio reprehenderit quia et suscipit suscipit recusandae consequuntur expedita et cum reprehenderit molestiae ut ut quas totam nostrum rerum est autem sunt rem eveniet architecto',
	},

	5: {
		id: 5,
		title: 'I am running out of ideas for post titles',
		body: 'sunt aut facere repellat provident occaecati excepturi optio reprehenderit quia et suscipit suscipit recusandae consequuntur expedita et cum reprehenderit molestiae ut ut quas totam nostrum rerum est autem sunt rem eveniet architecto',
	},

	6: {
		id: 6,
		title: 'Did you read so far? I am impressed!',
		body: 'sunt aut facere repellat provident occaecati excepturi optio reprehenderit quia et suscipit suscipit recusandae consequuntur expedita et cum reprehenderit molestiae ut ut quas totam nostrum rerum est autem sunt rem eveniet architecto',
	},
};

export const getPosts = async () => {
	await sleep(1000);

	return Object.values(posts);
};

export const getPost = async (id) => {
	await sleep(1000);

	return posts[id];
};

const sleep = (ms) => {
	return new Promise((resolve) => setTimeout(resolve, ms));
};
