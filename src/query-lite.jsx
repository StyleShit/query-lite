import { createContext, useContext, useSyncExternalStore } from 'react';

const queryContext = createContext();

export function QueryClientProvider({ client, children }) {
	return (
		<queryContext.Provider value={client}>{children}</queryContext.Provider>
	);
}

function useQueryClient() {
	return useContext(queryContext);
}

export class QueryClient {
	queries = new Map();

	getQuery(options) {
		const queryHash = JSON.stringify(options.queryKey);

		if (!this.queries.has(queryHash)) {
			this.queries.set(queryHash, createQuery(this, options));
		}

		return this.queries.get(queryHash);
	}

	deleteQuery(queryKey) {
		const queryHash = JSON.stringify(queryKey);

		this.queries.delete(queryHash);
	}
}

function createQuery(
	client,
	{ queryKey, queryFn, staleTime = 0, gcTime = 10000 },
) {
	const query = {
		state: {
			status: 'pending',
			isFetching: false,
			data: null,
			error: null,
		},

		subscribers: new Set(),

		setState(setter) {
			query.state = setter(query.state);

			query.subscribers.forEach((cb) => cb());
		},

		getState() {
			return query.state;
		},

		async fetch() {
			if (query.state.isFetching) {
				return;
			}

			if (staleTime && Date.now() - query.state.lastUpdated < staleTime) {
				return;
			}

			query.setState((prev) => ({
				...prev,
				isFetching: true,
			}));

			try {
				const data = await queryFn();

				query.setState((prev) => ({
					...prev,
					data,
					error: null,
					status: 'success',
					lastUpdated: Date.now(),
				}));
			} catch (e) {
				query.setState((prev) => ({
					...prev,
					error: e,
					status: 'error',
				}));
			} finally {
				query.setState((prev) => ({ ...prev, isFetching: false }));
			}
		},

		subscribe(cb) {
			query.unscheduleGC();

			query.subscribers.add(cb);

			query.fetch();

			return () => {
				query.subscribers.delete(cb);

				if (query.subscribers.size === 0) {
					query.scheduleGC();
				}
			};
		},

		scheduleGC() {
			if (!gcTime) {
				return;
			}

			query.gcTimeout = setTimeout(() => {
				client.deleteQuery(queryKey);
			}, gcTime);
		},

		unscheduleGC() {
			clearTimeout(query.gcTimeout);
		},
	};

	return query;
}

export function useQuery(options) {
	const queryClient = useQueryClient();
	const query = queryClient.getQuery(options);

	return useSyncExternalStore(query.subscribe, query.getState);
}
