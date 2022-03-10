import React, { useMemo, createContext, Context, useContext, ReactNode } from "react";
import useValidation, { TValidatorConfig } from "./hook/useValidation";

export type TValidationProps = {
	config: TValidatorConfig;
	children: ReactNode;
};

export const ValidationContext: Context<any> = createContext({});

export const ValidationProvider = (props: TValidationProps) => {
	const context = useValidation(props.config);
	const memoizedContext = useMemo(() => context, [context]);

	return <ValidationContext.Provider value={memoizedContext}>{props.children}</ValidationContext.Provider>;
};

export const useValidationStore = (): any => useContext<any>(ValidationContext);
