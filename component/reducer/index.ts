import { TFieldValue, TValidatorConfig, TValidatorState, TValidatorAction } from "../hook/useValidation";
import { Reducer } from "react";
import { validateFields } from "../hook/useValidation";

export const getInitialState = (config: TValidatorConfig): TValidatorState => {
	if (typeof config === "function") {
		config = config({});
	}

	const initialValues: TFieldValue = {};
	const initialBlurred: TFieldValue = {};
	const fieldConfigs = config.fields;
	const customValidators = config.customValidators || {};

	for (let fieldName in fieldConfigs) {
		initialValues[fieldName] = fieldConfigs[fieldName].hasOwnProperty("initialValue")
			? fieldConfigs[fieldName].initialValue
			: "";
		initialBlurred[fieldName] = false;
	}

	const initialErrors = validateFields(initialValues, fieldConfigs, customValidators);

	return {
		values: initialValues,
		errors: initialErrors,
		blurred: initialBlurred,
		submitted: false,
	};
};

export const validationReducer: Reducer<TValidatorState, TValidatorAction> = (state, action): TValidatorState => {
	switch (action.type) {
		case "change":
			const values = { ...state.values, ...action.payload };
			return {
				...state,
				values,
				submitted: false,
			};

		case "submit":
			return { ...state, submitted: true };

		case "validate":
			const errors = { ...state.errors, ...action.payload };
			return { ...state, errors };

		case "blur":
			const blurred = {
				...state.blurred,
				...action.payload,
			};
			return { ...state, blurred };

		default:
			return { ...state };
	}
};
