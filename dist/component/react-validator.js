import React, { useMemo, createContext, useContext } from "react";
import useValidation from "./hook/useValidation";
export var ValidationContext = createContext({});
export var ValidationProvider = function (props) {
    var context = useValidation(props.config);
    var memoizedContext = useMemo(function () { return context; }, [context]);
    return React.createElement(ValidationContext.Provider, { value: memoizedContext }, props.children);
};
export var useValidationStore = function () { return useContext(ValidationContext); };
