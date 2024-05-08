import { useState } from 'react';

// import {
// 	QueryClient,
// 	QueryClientProvider,
// 	useQuery,
// } from '@tanstack/react-query';

import { QueryClient, QueryClientProvider, useQuery } from './query-lite';

const queryClient = new QueryClient();

function App() {
	const [postId, setPostId] = useState(null);

	return (
		<QueryClientProvider client={queryClient}>
			<div className="App">
				{postId ? (
					<>
						<button onClick={() => setPostId(null)}>Back</button>
						<Post id={postId} />
					</>
				) : (
					<Posts onClick={setPostId} />
				)}
			</div>
		</QueryClientProvider>
	);
}

function usePosts() {
	return useQuery({
		queryKey: ['posts'],
		queryFn: async () => {
			const data = await fetch(
				'https://jsonplaceholder.typicode.com/posts',
			).then((res) => res.json());

			await sleep(1000);

			return data.slice(0, 5);
		},
	});
}

function usePost(id) {
	return useQuery({
		queryKey: ['posts', id],
		queryFn: async () => {
			const data = fetch(
				`https://jsonplaceholder.typicode.com/posts/${id}`,
			).then((res) => res.json());

			await sleep(1000);

			return data;
		},

		staleTime: 10000,
		gcTime: 20000,
	});
}

function Posts({ onClick }) {
	const { data, status, isFetching } = usePosts();

	return (
		<>
			<h1>Posts</h1>
			{status === 'pending' ? (
				<Loading />
			) : (
				<>
					<ul>
						{data.map((post) => (
							<li key={post.id}>
								<a href="#" onClick={() => onClick(post.id)}>
									{post.title}
								</a>
							</li>
						))}
					</ul>
					{isFetching && <BackgroundFetching />}
				</>
			)}
		</>
	);
}

function Post({ id }) {
	const { data, status, isFetching } = usePost(id);

	if (status === 'pending') {
		return <Loading />;
	}

	return (
		<div>
			<h2>{data.title}</h2>
			<p>{data.body}</p>
			{isFetching && <BackgroundFetching />}
		</div>
	);
}

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

function Loading() {
	return <span className="loading">Loading...</span>;
}

function BackgroundFetching() {
	return <span className="background-fetch">Background Fetching...</span>;
}

export default App;
