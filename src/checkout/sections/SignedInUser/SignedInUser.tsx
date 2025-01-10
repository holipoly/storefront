import React from "react";
import { useHolipolyAuthContext } from "@holipoly/auth-sdk/react";
import { SignInFormContainer, type SignInFormContainerProps } from "../Contact/SignInFormContainer";
import { Button } from "@/checkout/components/Button";
import { useUser } from "@/checkout/hooks/useUser";

interface SignedInUserProps extends Pick<SignInFormContainerProps, "onSectionChange"> {
	onSignOutSuccess: () => void;
}

export const SignedInUser: React.FC<SignedInUserProps> = ({ onSectionChange, onSignOutSuccess }) => {
	const { signOut } = useHolipolyAuthContext();

	const { user } = useUser();

	const handleLogout = async () => {
		signOut();
		onSignOutSuccess();
	};

	return (
		<SignInFormContainer title="Account" onSectionChange={onSectionChange}>
			<div className="flex flex-row justify-between">
				<p className="text-base font-bold">{user?.email}</p>
				<Button ariaLabel="Sign out" variant="tertiary" onClick={handleLogout} label="Sign out" />
			</div>
		</SignInFormContainer>
	);
};
