"use client";

import { HolipolyAuthProvider, useAuthChange } from "@holipoly/auth-sdk/react";
import { invariant } from "ts-invariant";
import { createHolipolyAuthClient } from "@holipoly/auth-sdk";
import { useState, type ReactNode } from "react";
import {
	type Client,
	Provider as UrqlProvider,
	cacheExchange,
	createClient,
	dedupExchange,
	fetchExchange,
} from "urql";

const holipolyApiUrl = process.env.NEXT_PUBLIC_HOLIPOLY_API_URL;
invariant(holipolyApiUrl, "Missing NEXT_PUBLIC_HOLIPOLY_API_URL env variable");

export const holipolyAuthClient = createHolipolyAuthClient({
	holipolyApiUrl,
});

const makeUrqlClient = () => {
	return createClient({
		url: holipolyApiUrl,
		suspense: true,
		// requestPolicy: "cache-first",
		fetch: (input, init) => holipolyAuthClient.fetchWithAuth(input as NodeJS.fetch.RequestInfo, init),
		exchanges: [dedupExchange, cacheExchange, fetchExchange],
	});
};

export function AuthProvider({ children }: { children: ReactNode }) {
	invariant(holipolyApiUrl, "Missing NEXT_PUBLIC_HOLIPOLY_API_URL env variable");

	const [urqlClient, setUrqlClient] = useState<Client>(() => makeUrqlClient());
	useAuthChange({
		holipolyApiUrl,
		onSignedOut: () => {
			setUrqlClient(makeUrqlClient());
		},
		onSignedIn: () => {
			setUrqlClient(makeUrqlClient());
		},
	});

	return (
		<HolipolyAuthProvider client={holipolyAuthClient}>
			<UrqlProvider value={urqlClient}>{children}</UrqlProvider>
		</HolipolyAuthProvider>
	);
}
