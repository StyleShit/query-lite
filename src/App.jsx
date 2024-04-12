import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
// import { useQuery, QueryClient, QueryClientProvider } from 'react-query';
import { useQuery } from './query-lite';
import { useState } from 'react';

// const queryClient = new QueryClient();

function App() {
	const [postId, setPostId] = useState(null);

	return (
		// <QueryClientProvider client={queryClient}>
		<div className="App">
			<header className="App-header">
				<img src={reactLogo} className="App-logo" alt="logo" />
				<img src={viteLogo} className="App-logo" alt="logo" />
				<h1>React Query Under the Hood</h1>
			</header>
			<main>
				{postId ? (
					<>
						<button onClick={() => setPostId(null)}>Back</button>
						<Post id={postId} />
					</>
				) : (
					<Posts onClick={setPostId} />
				)}
			</main>
		</div>
		// </QueryClientProvider>
	);
}

function Posts({ onClick }) {
	const { data, status, isFetching } = usePosts();

	if (status === 'loading') {
		return <p>Loading...</p>;
	}

	return (
		<>
			{isFetching && <p>Background Fetching...</p>}

			<ul>
				{data.map((post) => (
					<li key={post.id}>
						<button onClick={() => onClick(post.id)}>
							{post.title}
						</button>
					</li>
				))}
			</ul>
		</>
	);
}

function Post({ id }) {
	const { data, status, isFetching } = usePost(id);

	if (status === 'loading') {
		return <p>Loading...</p>;
	}

	return (
		<div>
			{isFetching && <p>Background Fetching...</p>}

			<h2>{data.title}</h2>
			<p>{data.body}</p>
		</div>
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

		// staleTime: 3000,
		// cacheTime: 5000,
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

		// staleTime: 3000,
		// cacheTime: 5000,
	});
}

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export default App;
