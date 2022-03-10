import { useCallback, useMemo, useReducer } from "react";
import useDeepCompareEffect from "use-deep-compare-effect";
import { validationReducer, getInitialState } from "../reducer";
import { TAnyOrNone } from "../types";
import { commonValidators } from "../validators/commonValidators";

type TFormConfig = {
	fields: TFieldConfig;
	onSubmit: (context: any) => void;
	showErrors: string;
	generalErrorFields?: string[];
	customValidators?: TFieldConfig;
};

type TValidatorActionType = "change" | "submit" | "blur" | "validate";

export type TValidatorAction = {
	type: TValidatorActionType;
	payload?: TAnyOrNone<TFieldValue>;
};

export type TValidatorConfig = ((obj: any) => TFormConfig) | TFormConfig;

export type TValidatorState = {
	values: TFieldValue;
	errors: TFieldValue;
	submitted: boolean;
	blurred?: TFieldValue;
};

export type TFieldValue = {
	[Key: string]: boolean | number | string | null | undefined;
};

export type TFieldConfig = {
	[Key: string]: any;
};

export type TOverrides = {
	onChange?: (e: any) => void;
	onBlur?: (e: any) => void;
	name?: string;
};

//=====================================================================================================================================//

/**
 * returns an errors object based on values set in state
 */
const getErrors = (state: TValidatorState, config: TValidatorConfig) => {
	const { blurred } = state;

	if (typeof config !== "function" && config.showErrors === "always") {
		return state.errors;
	}

	if (blurred && typeof config !== "function" && !state.submitted) {
		const entries = Object.entries(blurred);
		const filtered = entries.filter(([, blurred]) => blurred);

		if(Array.isArray(filtered) && filtered.length) {
			const reduced = filtered.reduce((acc, [name]) => ({ ...acc, [name]: state.errors[name] }), {});
			return reduced;
		}
	}

	return state.submitted ? state.errors : {};
};

/**
 * loops through all fields provided in config and calls validateField function for each one
 * return an object with keys being the fieldName and values being the error strings (or null)
 */
export const validateFields = (
	fieldValues: TFieldValue,
	fieldConfigs: TFieldConfig,
	customValidators: TFieldConfig = {}
) => {
	const errors: TFieldValue = {};

	for (let fieldName in fieldConfigs) {
		const fieldConfig = fieldConfigs[fieldName];
		const fieldValue = fieldValues[fieldName];

		errors[fieldName] = validateField(fieldValue, fieldConfig, fieldValues, customValidators);
	}

	return errors;
};

/**
 * executes validator functions for a single field value in state
 * returns string error message or null
 */
export const validateField = (fieldValue: any = "", fieldConfig: any, stateValues: any, customValidators: any) => {
	const specialProps = ["initialValue", "showErrors", "showGeneralError"];
	const comparisonValidators = ["minValueCheck", "maxValueCheck"];
	const validators = {
		...commonValidators,
		...customValidators,
	};

	for (let validatorName in fieldConfig) {
		if (specialProps.includes(validatorName)) {
			continue;
		}

		let validatorConfig = fieldConfig[validatorName];

		if (comparisonValidators.includes(validatorName)) {
			const { comparisonKey } = validatorConfig;
			validatorConfig = {
				...validatorConfig,
				comparisonValue: stateValues[comparisonKey],
			};
			delete validatorConfig.comparisonKey;
		}

		if (typeof validatorConfig === "string") {
			validatorConfig = { message: validatorConfig };
		}

		validatorConfig = { ...validatorConfig, val: fieldValue, stateValues };
		const configuredValidator = (validators as any)[validatorName](validatorConfig);
		const errorMessage = configuredValidator;

		if (errorMessage) {
			return errorMessage;
		}
	}

	return null;
};

/**
 * if generalErrorFields is not empty then -
 * to prevent an empty form submission this function checks
 * whether AT LEAST one field out of a set of fields
 * is filled or not
 * @param fieldValues
 * @param fieldConfigs
 * @param generalErrorFields
 * @returns {Boolean}
 */
export const validateFieldsOnSubmit = (fieldValues: any, fieldConfigs: any, generalErrorFields: any) => {
	if (Array.isArray(generalErrorFields) && generalErrorFields.length) {
		let errorFlag = true;

		for (let fieldName in fieldConfigs) {
			if (generalErrorFields.includes(fieldName)) {
				const fieldValue = fieldValues[fieldName];
				if (fieldValue) errorFlag = false;
			}
		}

		return errorFlag;
	}

	return false;
};

//=====================================================================================================================================//

/**
 * validator hook: can be used by children components of ValidationProvider
 * the config passed as a prop to ValidationProvider is used in this hook
 * returns an object with functions for input fields and boolean flags for state monitoring
 */
const useValidation = (config: TValidatorConfig) => {
	const [state, dispatch] = useReducer(validationReducer, getInitialState(config));

	if (typeof config === "function") {
		config = config(state.values);
	}

	useDeepCompareEffect(() => {
		if (typeof config !== "function") {
			const errors = validateFields(state.values, config.fields, config.customValidators);
			dispatch({
				type: "validate",
				payload: { ...errors, generalError: null },
			});
		}
	}, [state.values]);

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const errors = useMemo(() => getErrors(state, config), [state]);

	const isFormValid = useMemo(() => {
		return Object.values(errors).every((error) => error === null);
	}, [errors]);

	const _setFieldValue = useCallback((fieldName: string, value: any) => {
		dispatch({
			type: "change",
			payload: { [fieldName]: value },
		});
	}, []);

	return {
		errors,
		submitted: state.submitted,
		isFormValid,
		getFormProps: () => ({
			onSubmit: (e: any) => {
				e && e.preventDefault();
				dispatch({ type: "submit" });
				if (typeof config !== "function" && config.onSubmit) {
					const errorFlag = validateFieldsOnSubmit(state.values, config.fields, config.generalErrorFields);

					dispatch({
						type: "validate",
						payload: {
							generalError: errorFlag ? "Please enter some search criteria to get results" : null,
						},
					});

					return config.onSubmit({
						...state,
						isFormValid: errorFlag ? false : isFormValid,
					});
				}
			},
		}),
		setFieldValue: _setFieldValue,
		setErrors: (payload: TFieldValue) => {
			dispatch({
				type: "validate",
				payload,
			});
		},
		getFieldProps: (fieldName: string, overrides: TOverrides = {}) => ({
			onChange: (e: any) => {
				const { value } = e.target;
				if (typeof config !== "function" && !config.fields[fieldName]) {
					return;
				}
				dispatch({
					type: "change",
					payload: { [fieldName]: value },
				});
				if (overrides.onChange) {
					overrides.onChange(e);
				}
			},
			onBlur: (e: any) => {
				dispatch({ type: "blur", payload: { [fieldName]: true } });
				if (overrides.onBlur) {
					overrides.onBlur(e);
				}
			},
			name: overrides.name || fieldName,
			value: state.values[fieldName] || "",
		}),
	};
};

export default useValidation;
