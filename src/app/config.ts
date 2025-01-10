import { createHolipolyAuthClient } from "@holipoly/auth-sdk";
import { getNextServerCookiesStorage } from "@holipoly/auth-sdk/next/server";
import { invariant } from "ts-invariant";

export const ProductsPerPage = 12;

const holipolyApiUrl = process.env.NEXT_PUBLIC_HOLIPOLY_API_URL;
invariant(holipolyApiUrl, "Missing NEXT_PUBLIC_HOLIPOLY_API_URL env variable");

export const getServerAuthClient = () => {
	const nextServerCookiesStorage = getNextServerCookiesStorage();
	return createHolipolyAuthClient({
		holipolyApiUrl,
		refreshTokenStorage: nextServerCookiesStorage,
		accessTokenStorage: nextServerCookiesStorage,
	});
};
