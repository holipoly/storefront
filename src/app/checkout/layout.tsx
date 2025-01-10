import { type ReactNode } from "react";
import { AuthProvider } from "@/ui/components/AuthProvider";

export const metadata = {
	title: "Holipoly Storefront example",
	description: "Starter pack for building performant e-commerce experiences with Holipoly.",
};

export default function RootLayout(props: { children: ReactNode }) {
	return (
		<main>
			<AuthProvider>{props.children}</AuthProvider>
		</main>
	);
}
