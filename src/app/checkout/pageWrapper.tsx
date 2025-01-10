"use client";

import dynamic from "next/dynamic";

const Root = dynamic(() => import("@/checkout/Root").then((m) => m.Root), { ssr: false });

export const RootWrapper = ({ holipolyApiUrl }: { holipolyApiUrl: string }) => {
	if (!holipolyApiUrl) {
		return null;
	}
	return <Root holipolyApiUrl={holipolyApiUrl} />;
};
