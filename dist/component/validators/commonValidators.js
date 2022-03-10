import { errorStrings } from "../constants/errorStrings";
export function RunAddToInputValidation(val, maxLength) {
    if (maxLength === void 0) { maxLength = 50; }
    var regex1 = new RegExp("^[\\\\a-zA-Z0-9_!\"\\]#$%&'()*+,-./:;<=>?@[^`{}|~ ]*$");
    var validationResult = {
        errStatus: false,
        message: "",
        disableSubmit: false,
    };
    if (!val) {
        validationResult.disableSubmit = true;
    }
    else if (val.length > maxLength) {
        validationResult.errStatus = true;
        validationResult.message = errorStrings.maxCharatersError(maxLength);
        validationResult.disableSubmit = true;
    }
    else if (!regex1.test(val)) {
        validationResult.errStatus = true;
        validationResult.message = errorStrings.specialCharactersError;
        validationResult.disableSubmit = true;
    }
    return validationResult;
}
//=========================================================================================================================================================//
// common validations
var errs = window.commonErrList || {};
export var commonValidators = {
    isRequired: function (_a, vCd) {
        var val = _a.val, message = _a.message;
        var regX = /^\s*$/;
        if (errs[vCd]) {
            regX = new RegExp(errs[vCd].regEx || regX);
        }
        return regX.test(val) ? message : false;
    },
    isMaxLength: function (_a) {
        var val = _a.val, length = _a.length, message = _a.message;
        var inplength = val && val.length;
        if (inplength > length) {
            if (typeof message === "function") {
                return message(length);
            }
            return message;
        }
        return false;
    },
    isMinLength: function (_a) {
        var val = _a.val, length = _a.length, message = _a.message;
        var inplength = val && val.length;
        if (inplength < length) {
            if (typeof message === "function") {
                return message(length);
            }
            return message;
        }
        return false;
    },
    alphadsChk: function (val, vCd) {
        var regX = /^[a-zA-Z.\s]+$/;
        if (errs[vCd]) {
            regX = new RegExp(errs[vCd].regEx || regX);
        }
        if (val !== "") {
            val = val.trim();
            if (val.indexOf(".") === 0) {
                return true;
            }
            else if (!regX.test(val)) {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    },
    alphaChk: function (val, vCd) {
        var regX = /^[a-zA-Z]+$/;
        if (errs[vCd]) {
            regX = new RegExp(errs[vCd].regEx || regX);
        }
        if (val !== "") {
            if (!regX.test(val.trim())) {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    },
    numChk: function (val, vCd) {
        var regX = /^[-]?[0-9]+$/;
        if (errs[vCd]) {
            regX = new RegExp(errs[vCd].regEx || regX);
        }
        if (val !== "") {
            if (!regX.test(val.trim())) {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    },
    floatChk: function (_a, vCd) {
        var val = _a.val, message = _a.message;
        var regX = /^[0-9]+(\.[0-9]+)?([eE][+-]?[0-9]+)?$/;
        if (errs[vCd]) {
            regX = new RegExp(errs[vCd].regEx || regX);
        }
        if (val !== "") {
            if (!regX.test(val.trim())) {
                return message;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    },
    alphanumChk: function (val, vCd) {
        var regX = /^[a-zA-Z0-9]+$/;
        if (errs[vCd]) {
            regX = new RegExp(errs[vCd].regEx || regX);
        }
        if (val !== "") {
            if (!regX.test(val.trim())) {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    },
    emailChk: function (val, vCd) {
        // eslint-disable-next-line no-useless-escape
        var regX = /^([0-9a-zA-Z]([\.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,4})$/;
        if (errs[vCd]) {
            regX = new RegExp(errs[vCd].regEx || regX);
        }
        if (val !== "") {
            if (!regX.test(val.trim())) {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    },
    splChk: function (_a, vCd) {
        var val = _a.val, message = _a.message;
        var regX = /^[a-zA-Z\d\s]+$/;
        if (errs[vCd]) {
            regX = new RegExp(errs[vCd].regEx || regX);
        }
        if (val !== "") {
            if (!regX.test(val.trim())) {
                return message;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    },
    rangeChk: function (val, minL, maxL, _scop) {
        if (!maxL || maxL === "") {
            maxL = val.length + 1;
        }
        if (val !== "") {
            var scop = _scop || "in";
            if (scop === "in") {
                if (val.length < minL || val.length > maxL) {
                    return minL + ":" + maxL;
                }
                else {
                    return false;
                }
            }
            else if (scop === "out") {
                if (val.length > minL) {
                    if (val.length < maxL) {
                        return minL + ":" + maxL;
                    }
                }
                else {
                    return false;
                }
            }
        }
        else {
            return false;
        }
    },
    rangeVChk: function (val, minV, maxV, _scop) {
        if (val !== "") {
            var scop = _scop || "in";
            if (scop === "in") {
                if (parseFloat(val.trim()) < minV || parseFloat(val.trim()) > maxV) {
                    return minV + ":" + maxV;
                }
                else {
                    return false;
                }
            }
            else if (scop === "out") {
                if (parseFloat(val.trim()) > minV) {
                    if (parseFloat(val.trim()) < maxV) {
                        return minV + ":" + maxV;
                    }
                }
                else {
                    return false;
                }
            }
        }
        else {
            return false;
        }
    },
    checkedChkSrv: function (val) {
        return val === null || val === "" ? true : false;
    },
    selectedChk: function (elm) {
        return elm.get(0).selectedIndex !== 0 ? false : true;
    },
    selectedChkSrv: function (val, dVal) {
        return val === dVal ? true : false;
    },
    reqChk: function (val) {
        return val === "" ? false : true;
    },
    checkValid: function (typ, val, dVal, dSel, mnL, mxL, mnV, mxV, s, cst, fCod) {
        switch (typ) {
            case "required": {
                return this.reqChk(val);
            }
            case "alphaDS": {
                return this.alphadsChk(val, fCod);
            }
            case "alpha": {
                return this.alphaChk(val, fCod);
            }
            case "num": {
                return this.numChk(val, fCod);
            }
            case "float": {
                return this.floatChk(val, fCod);
            }
            case "alphanum": {
                return this.alphanumChk(val, fCod);
            }
            case "email": {
                return this.emailChk(val, fCod);
            }
            case "specialChar": {
                return this.splChk(val, fCod);
            }
            case "charRange": {
                return this.rangeChk(val, mnL, mxL, s);
            }
            case "valRange": {
                return this.rangeVChk(val, mnV, mxV, s);
            }
            case "checked": {
                return this.checkedChkSrv(val);
            }
            case "selected": {
                return this.selectedChkSrv(val, dSel);
            }
            case "custom": {
                var obj = errs.errs[fCod], fn = typeof obj === "function" ? obj : obj;
                var value = fn.apply(this, val);
                if (typeof value === "object" && value.msg === false)
                    value = "";
                return value;
            }
        }
    },
};
