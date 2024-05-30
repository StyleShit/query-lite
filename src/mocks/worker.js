import { http, HttpResponse } from 'msw';
import { setupWorker } from 'msw/browser';
import { posts } from './posts';

export const worker = setupWorker(
	http.get('/posts', async () => {
		await sleep(1000);

		return HttpResponse.json(Object.values(posts));
	}),

	http.get('/posts/:id', async (req) => {
		const { id } = req.params;

		await sleep(1000);

		return HttpResponse.json(posts[id]);
	}),
);

const sleep = (ms) => {
	return new Promise((resolve) => setTimeout(resolve, ms));
};
