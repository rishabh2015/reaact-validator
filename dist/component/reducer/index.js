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
import { validateFields } from "../hook/useValidation";
export var getInitialState = function (config) {
    if (typeof config === "function") {
        config = config({});
    }
    var initialValues = {};
    var initialBlurred = {};
    var fieldConfigs = config.fields;
    var customValidators = config.customValidators || {};
    for (var fieldName in fieldConfigs) {
        initialValues[fieldName] = fieldConfigs[fieldName].hasOwnProperty("initialValue")
            ? fieldConfigs[fieldName].initialValue
            : "";
        initialBlurred[fieldName] = false;
    }
    var initialErrors = validateFields(initialValues, fieldConfigs, customValidators);
    return {
        values: initialValues,
        errors: initialErrors,
        blurred: initialBlurred,
        submitted: false,
    };
};
export var validationReducer = function (state, action) {
    switch (action.type) {
        case "change":
            var values = __assign(__assign({}, state.values), action.payload);
            return __assign(__assign({}, state), { values: values, submitted: false });
        case "submit":
            return __assign(__assign({}, state), { submitted: true });
        case "validate":
            var errors = __assign(__assign({}, state.errors), action.payload);
            return __assign(__assign({}, state), { errors: errors });
        case "blur":
            var blurred = __assign(__assign({}, state.blurred), action.payload);
            return __assign(__assign({}, state), { blurred: blurred });
        default:
            return __assign({}, state);
    }
};
