var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
import { useCallback, useMemo, useReducer } from "react";
import useDeepCompareEffect from "use-deep-compare-effect";
import { validationReducer, getInitialState } from "../reducer";
import { commonValidators } from "../validators/commonValidators";
//=====================================================================================================================================//
/**
 * returns an errors object based on values set in state
 */
var getErrors = function (state, config) {
    var blurred = state.blurred;
    if (typeof config !== "function" && config.showErrors === "always") {
        return state.errors;
    }
    if (blurred && typeof config !== "function" && !state.submitted) {
        var entries = Object.entries(blurred);
        var filtered = entries.filter(function (_a) {
            var _b = __read(_a, 2), blurred = _b[1];
            return blurred;
        });
        if (Array.isArray(filtered) && filtered.length) {
            var reduced = filtered.reduce(function (acc, _a) {
                var _b;
                var _c = __read(_a, 1), name = _c[0];
                return (__assign(__assign({}, acc), (_b = {}, _b[name] = state.errors[name], _b)));
            }, {});
            return reduced;
        }
    }
    return state.submitted ? state.errors : {};
};
/**
 * loops through all fields provided in config and calls validateField function for each one
 * return an object with keys being the fieldName and values being the error strings (or null)
 */
export var validateFields = function (fieldValues, fieldConfigs, customValidators) {
    if (customValidators === void 0) { customValidators = {}; }
    var errors = {};
    for (var fieldName in fieldConfigs) {
        var fieldConfig = fieldConfigs[fieldName];
        var fieldValue = fieldValues[fieldName];
        errors[fieldName] = validateField(fieldValue, fieldConfig, fieldValues, customValidators);
    }
    return errors;
};
/**
 * executes validator functions for a single field value in state
 * returns string error message or null
 */
export var validateField = function (fieldValue, fieldConfig, stateValues, customValidators) {
    if (fieldValue === void 0) { fieldValue = ""; }
    var specialProps = ["initialValue", "showErrors", "showGeneralError"];
    var comparisonValidators = ["minValueCheck", "maxValueCheck"];
    var validators = __assign(__assign({}, commonValidators), customValidators);
    for (var validatorName in fieldConfig) {
        if (specialProps.includes(validatorName)) {
            continue;
        }
        var validatorConfig = fieldConfig[validatorName];
        if (comparisonValidators.includes(validatorName)) {
            var comparisonKey = validatorConfig.comparisonKey;
            validatorConfig = __assign(__assign({}, validatorConfig), { comparisonValue: stateValues[comparisonKey] });
            delete validatorConfig.comparisonKey;
        }
        if (typeof validatorConfig === "string") {
            validatorConfig = { message: validatorConfig };
        }
        validatorConfig = __assign(__assign({}, validatorConfig), { val: fieldValue, stateValues: stateValues });
        var configuredValidator = validators[validatorName](validatorConfig);
        var errorMessage = configuredValidator;
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
export var validateFieldsOnSubmit = function (fieldValues, fieldConfigs, generalErrorFields) {
    if (Array.isArray(generalErrorFields) && generalErrorFields.length) {
        var errorFlag = true;
        for (var fieldName in fieldConfigs) {
            if (generalErrorFields.includes(fieldName)) {
                var fieldValue = fieldValues[fieldName];
                if (fieldValue)
                    errorFlag = false;
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
var useValidation = function (config) {
    var _a = __read(useReducer(validationReducer, getInitialState(config)), 2), state = _a[0], dispatch = _a[1];
    if (typeof config === "function") {
        config = config(state.values);
    }
    useDeepCompareEffect(function () {
        if (typeof config !== "function") {
            var errors_1 = validateFields(state.values, config.fields, config.customValidators);
            dispatch({
                type: "validate",
                payload: __assign(__assign({}, errors_1), { generalError: null }),
            });
        }
    }, [state.values]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    var errors = useMemo(function () { return getErrors(state, config); }, [state]);
    var isFormValid = useMemo(function () {
        return Object.values(errors).every(function (error) { return error === null; });
    }, [errors]);
    var _setFieldValue = useCallback(function (fieldName, value) {
        var _a;
        dispatch({
            type: "change",
            payload: (_a = {}, _a[fieldName] = value, _a),
        });
    }, []);
    return {
        errors: errors,
        submitted: state.submitted,
        isFormValid: isFormValid,
        getFormProps: function () { return ({
            onSubmit: function (e) {
                e && e.preventDefault();
                dispatch({ type: "submit" });
                if (typeof config !== "function" && config.onSubmit) {
                    var errorFlag = validateFieldsOnSubmit(state.values, config.fields, config.generalErrorFields);
                    dispatch({
                        type: "validate",
                        payload: {
                            generalError: errorFlag ? "Please enter some search criteria to get results" : null,
                        },
                    });
                    return config.onSubmit(__assign(__assign({}, state), { isFormValid: errorFlag ? false : isFormValid }));
                }
            },
        }); },
        setFieldValue: _setFieldValue,
        setErrors: function (payload) {
            dispatch({
                type: "validate",
                payload: payload,
            });
        },
        getFieldProps: function (fieldName, overrides) {
            if (overrides === void 0) { overrides = {}; }
            return ({
                onChange: function (e) {
                    var _a;
                    var value = e.target.value;
                    if (typeof config !== "function" && !config.fields[fieldName]) {
                        return;
                    }
                    dispatch({
                        type: "change",
                        payload: (_a = {}, _a[fieldName] = value, _a),
                    });
                    if (overrides.onChange) {
                        overrides.onChange(e);
                    }
                },
                onBlur: function (e) {
                    var _a;
                    dispatch({ type: "blur", payload: (_a = {}, _a[fieldName] = true, _a) });
                    if (overrides.onBlur) {
                        overrides.onBlur(e);
                    }
                },
                name: overrides.name || fieldName,
                value: state.values[fieldName] || "",
            });
        },
    };
};
export default useValidation;
