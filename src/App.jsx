import { useState } from 'react';
import { Timer } from './timer';
import { BackgroundFetching, Loading } from './loaders';

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
				{postId === null ? (
					<Posts onClick={setPostId} />
				) : (
					<Post id={postId} goBack={() => setPostId(null)} />
				)}
			</div>
		</QueryClientProvider>
	);
}

function usePosts() {
	return useQuery({
		queryKey: ['posts'],
		queryFn: () => {
			return fetch('/posts').then((res) => res.json());
		},
	});
}

function usePost(id) {
	return useQuery({
		queryKey: ['posts', id],
		queryFn: () => {
			return fetch(`/posts/${id}`).then((res) => res.json());
		},

		staleTime: 10000,
		gcTime: 15000,
	});
}

function Posts({ onClick }) {
	const { data, status, isFetching } = usePosts();

	return (
		<>
			<div className="title-wrapper">
				<h1>Posts</h1>

				{status !== 'pending' && isFetching && <BackgroundFetching />}

				<Timer />
			</div>

			{status === 'pending' ? (
				<Loading />
			) : (
				<ul>
					{data.map((post) => (
						<li key={post.id}>
							<a href="#" onClick={() => onClick(post.id)}>
								{post.title}
							</a>
						</li>
					))}
				</ul>
			)}
		</>
	);
}

function Post({ id, goBack }) {
	const { data, status, isFetching } = usePost(id);

	return (
		<>
			<div className="title-wrapper">
				<button onClick={goBack}>Back</button>

				{status !== 'pending' && isFetching && <BackgroundFetching />}
			</div>

			{status === 'pending' ? (
				<Loading />
			) : (
				<div>
					<h2>{data.title}</h2>
					<p>{data.body}</p>
				</div>
			)}
		</>
	);
}

export default App;
