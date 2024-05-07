import { createContext, useContext } from 'react';

const queryContext = createContext();

export function QueryClientProvider({ client, children }) {
	return (
		<queryContext.Provider value={client}>{children}</queryContext.Provider>
	);
}

function useQueryClient() {
	return useContext(queryContext);
}

export class QueryClient {}

export function useQuery(options) {
	return {
		status: 'pending',
		isFetching: true,
		data: null,
		error: null,
	};
}
