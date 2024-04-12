import { useSyncExternalStore } from 'react';

class QueryClient {
	constructor() {
		this.queries = new Map();
	}

	getQuery(options) {
		const queryHash = JSON.stringify(options.queryKey);

		if (!this.queries.has(queryHash)) {
			this.queries.set(queryHash, createQuery(this, options));
		}

		return this.queries.get(queryHash);
	}

	removeQuery(queryHash) {
		this.queries.delete(queryHash);
	}
}

function createQuery(client, options) {
	const { queryKey, queryFn, staleTime, cacheTime } = options;

	const query = {
		queryKey,

		queryHash: JSON.stringify(queryKey),

		state: {
			status: 'loading',
			isFetching: false,
			data: null,
			error: null,
			lastUpdated: null,
		},

		gcTimeout: null,

		subscribers: new Set(),

		subscribe: (cb) => {
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

		scheduleGC: () => {
			query.gcTimeout = setTimeout(() => {
				client.removeQuery(query.queryHash);

				console.log('GCd', query.queryHash);
			}, cacheTime);
		},

		unscheduleGC: () => {
			clearTimeout(query.gcTimeout);
		},

		notify: () => {
			query.subscribers.forEach((cb) => cb());
		},

		setState: (updater) => {
			query.state = updater(query.state);

			query.notify();
		},

		getState: () => query.state,

		fetch: async () => {
			if (query.state.isFetching) {
				return;
			}

			const isFresh =
				query.state.lastUpdated !== null &&
				Date.now() - query.state.lastUpdated <= staleTime;

			if (isFresh) {
				return;
			}

			query.setState((state) => ({
				...state,
				isFetching: true,
			}));

			try {
				const data = await queryFn();

				query.setState(() => ({
					status: 'success',
					data,
					error: null,
					lastUpdated: Date.now(),
				}));
			} catch (error) {
				query.setState(() => ({
					status: 'error',
					error,
					data: null,
				}));
			} finally {
				query.promise = null;

				query.setState((state) => ({
					...state,
					isFetching: false,
				}));
			}
		},
	};

	return query;
}

const queryClient = new QueryClient();

export function useQuery({
	queryKey,
	queryFn,
	staleTime = 0,
	cacheTime = 10000,
}) {
	const query = queryClient.getQuery({
		queryKey,
		queryFn,
		staleTime,
		cacheTime,
	});

	return useSyncExternalStore(query.subscribe, query.getState);
}
