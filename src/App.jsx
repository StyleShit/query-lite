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
					<>
						<button onClick={() => setPostId(null)}>Back</button>
						<Post id={postId} />
					</>
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
			<div style={{ display: 'flex', justifyContent: 'space-between' }}>
				<h1>Posts</h1>
				<Timer />
			</div>

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

export default App;
