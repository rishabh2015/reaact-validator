import { errorStrings } from "../constants/errorStrings";

export type TValidationResult = {
	errStatus: boolean;
	message: string;
	errCode?: number;
	disableSubmit?: boolean;
};

export function RunAddToInputValidation(val: string, maxLength: number = 50): TValidationResult {
	const regex1 = new RegExp("^[\\\\a-zA-Z0-9_!\"\\]#$%&'()*+,-./:;<=>?@[^`{}|~ ]*$");

	let validationResult: TValidationResult = {
		errStatus: false,
		message: "",
		disableSubmit: false,
	};

	if (!val) {
		validationResult.disableSubmit = true;
	} else if (val.length > maxLength) {
		validationResult.errStatus = true;
		validationResult.message = errorStrings.maxCharatersError(maxLength);
		validationResult.disableSubmit = true;
	} else if (!regex1.test(val)) {
		validationResult.errStatus = true;
		validationResult.message = errorStrings.specialCharactersError;
		validationResult.disableSubmit = true;
	}

	return validationResult;
}

//=========================================================================================================================================================//
// common validations

const errs = (window as any).commonErrList || {};

export const commonValidators = {
	isRequired: function ({ val, message }: any, vCd: string | number) {
		let regX = /^\s*$/;

		if (errs[vCd]) {
			regX = new RegExp(errs[vCd].regEx || regX);
		}

		return regX.test(val) ? message : false;
	},

	isMaxLength: function ({ val, length, message }: any) {
		const inplength = val && val.length;

		if (inplength > length) {
			if (typeof message === "function") {
				return message(length);
			}
			return message;
		}
		return false;
	},

	isMinLength: function ({ val, length, message }: any) {
		const inplength = val && val.length;

		if (inplength < length) {
			if (typeof message === "function") {
				return message(length);
			}
			return message;
		}
		return false;
	},

	alphadsChk: function (val: string, vCd: string | number) {
		let regX = /^[a-zA-Z.\s]+$/;

		if (errs[vCd]) {
			regX = new RegExp(errs[vCd].regEx || regX);
		}

		if (val !== "") {
			val = val.trim();

			if (val.indexOf(".") === 0) {
				return true;
			} else if (!regX.test(val)) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	},

	alphaChk: function (val: string, vCd: string | number) {
		let regX = /^[a-zA-Z]+$/;

		if (errs[vCd]) {
			regX = new RegExp(errs[vCd].regEx || regX);
		}
		if (val !== "") {
			if (!regX.test(val.trim())) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	},

	numChk: function (val: string, vCd: string | number) {
		let regX = /^[-]?[0-9]+$/;

		if (errs[vCd]) {
			regX = new RegExp(errs[vCd].regEx || regX);
		}
		if (val !== "") {
			if (!regX.test(val.trim())) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	},

	floatChk: function ({ val, message }: any, vCd: string | number) {
		let regX = /^[0-9]+(\.[0-9]+)?([eE][+-]?[0-9]+)?$/;

		if (errs[vCd]) {
			regX = new RegExp(errs[vCd].regEx || regX);
		}
		if (val !== "") {
			if (!regX.test(val.trim())) {
				return message;
			} else {
				return false;
			}
		} else {
			return false;
		}
	},

	alphanumChk: function (val: string, vCd: string | number) {
		let regX = /^[a-zA-Z0-9]+$/;

		if (errs[vCd]) {
			regX = new RegExp(errs[vCd].regEx || regX);
		}
		if (val !== "") {
			if (!regX.test(val.trim())) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	},

	emailChk: function (val: string, vCd: string | number) {
		// eslint-disable-next-line no-useless-escape
		let regX = /^([0-9a-zA-Z]([\.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,4})$/;

		if (errs[vCd]) {
			regX = new RegExp(errs[vCd].regEx || regX);
		}
		if (val !== "") {
			if (!regX.test(val.trim())) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	},

	splChk: function ({ val, message }: any, vCd: string | number) {
		let regX = /^[a-zA-Z\d\s]+$/;

		if (errs[vCd]) {
			regX = new RegExp(errs[vCd].regEx || regX);
		}
		if (val !== "") {
			if (!regX.test(val.trim())) {
				return message;
			} else {
				return false;
			}
		} else {
			return false;
		}
	},

	rangeChk: function (val: string | String | any[], minL: string | number, maxL: string | number, _scop: string) {
		if (!maxL || maxL === "") {
			maxL = val.length + 1;
		}

		if (val !== "") {
			let scop = _scop || "in";

			if (scop === "in") {
				if (val.length < minL || val.length > maxL) {
					return minL + ":" + maxL;
				} else {
					return false;
				}
			} else if (scop === "out") {
				if (val.length > minL) {
					if (val.length < maxL) {
						return minL + ":" + maxL;
					}
				} else {
					return false;
				}
			}
		} else {
			return false;
		}
	},

	rangeVChk: function (val: string, minV: string | number, maxV: string | number, _scop: string) {
		if (val !== "") {
			let scop = _scop || "in";

			if (scop === "in") {
				if (parseFloat(val.trim()) < minV || parseFloat(val.trim()) > maxV) {
					return minV + ":" + maxV;
				} else {
					return false;
				}
			} else if (scop === "out") {
				if (parseFloat(val.trim()) > minV) {
					if (parseFloat(val.trim()) < maxV) {
						return minV + ":" + maxV;
					}
				} else {
					return false;
				}
			}
		} else {
			return false;
		}
	},

	checkedChkSrv: function (val: string | null) {
		return val === null || val === "" ? true : false;
	},

	selectedChk: function (elm: { get: (arg0: number) => { (): any; new (): any; selectedIndex: number } }) {
		return elm.get(0).selectedIndex !== 0 ? false : true;
	},

	selectedChkSrv: function (val: any, dVal: any) {
		return val === dVal ? true : false;
	},

	reqChk: function (val: any) {
		return val === "" ? false : true;
	},

	checkValid: function (
		typ: any,
		val: any,
		dVal: any,
		dSel: any,
		mnL: any,
		mxL: any,
		mnV: any,
		mxV: any,
		s: any,
		cst: any,
		fCod: string | number
	): any {
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
				let obj = errs.errs[fCod],
					fn = typeof obj === "function" ? obj : obj;
				let value = fn.apply(this, val);

				if (typeof value === "object" && value.msg === false) value = "";
				return value;
			}
		}
	},
};
