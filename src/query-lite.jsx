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

function createQuery(client, { queryKey, queryFn, staleTime, gcTime }) {
	let state = {
		status: 'pending',
		isFetching: false,
		data: null,
		error: null,
	};

	const setState = (setter) => {
		state = setter(state);

		subscribers.forEach((cb) => cb());
	};

	const getState = () => state;

	const fetchData = async () => {
		if (state.isFetching) {
			return;
		}

		if (staleTime && Date.now() - state.lastUpdated < staleTime) {
			return;
		}

		setState((prev) => ({
			...prev,
			isFetching: true,
		}));

		try {
			const data = await queryFn();

			setState((prev) => ({
				...prev,
				data,
				error: null,
				status: 'success',
				lastUpdated: Date.now(),
			}));
		} catch (e) {
			setState((prev) => ({
				...prev,
				error: e,
				status: 'error',
			}));
		}

		setState((prev) => ({ ...prev, isFetching: false }));
	};

	const subscribers = new Set();

	const subscribe = (cb) => {
		unscheduleGC();

		subscribers.add(cb);

		fetchData();

		return () => {
			subscribers.delete(cb);

			if (subscribers.size === 0) {
				scheduleGC();
			}
		};
	};

	let gcTimeout;

	const scheduleGC = () => {
		if (!gcTime) {
			return;
		}

		gcTimeout = setTimeout(() => {
			client.deleteQuery(queryKey);
		}, gcTime);
	};

	const unscheduleGC = () => {
		clearTimeout(gcTimeout);
	};

	return {
		getState,
		subscribe,
	};
}

export function useQuery(options) {
	const queryClient = useQueryClient();
	const query = queryClient.getQuery(options);

	return useSyncExternalStore(query.subscribe, query.getState);
}
