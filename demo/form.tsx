import React, { ReactElement, useEffect, useState } from "react";
import { ValidationProvider, useValidationStore } from "../index";
import './style.scss';

const Form = () => {
    const {setFieldValue, errors, getFormProps, getFieldProps, submitted, isFormValid} = useValidationStore();
    const {onSubmit} = getFormProps();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const {onBlur: onUsernameBlur} = getFieldProps("username", {});
    const {onBlur: onPasswordBlur} = getFieldProps("password", {})

    const _onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e && e.preventDefault();
        onSubmit();
    };

    useEffect(() => {
        if(submitted && isFormValid) {
            console.log("----------------------- make the ajax call -----------------------");
        }
    }, [submitted, isFormValid]);

    const onPasswordChange = (value: string) => {
        setPassword(value);
        setFieldValue("password", value);
    };

    const onUsernameChange = (value: string) => {
        setUsername(value);
        setFieldValue("username", value);
    };

    useEffect(() => {
        if(submitted && isFormValid) {
            console.log("%c ------------------------ form is valid ------------------------- ", "color:white; background:green");
        } else if(submitted && !isFormValid) {
            console.log("%c ------------------------ form is not valid --------------------- ", "color:white; background:red");
        }
    }, [submitted, isFormValid])

    return (
        <div className="content">
            <form onSubmit={(e) => _onSubmit(e)}>
                <div className="form-group">
                    <div className={`${errors.username ? "err" : ""}`}>
                        <input type="text" placeholder="Username" value={username} onChange={(e) => onUsernameChange(e.target.value)} onBlur={onUsernameBlur}/>
                    </div>
                    {errors.username && <div className="err-msg">
                        {errors.username}
                    </div>}
                </div>
                <div className="form-group">
                    <div className={`${errors.password ? "err" : ""}`}>
                        <input type="password" placeholder="Password" value={password} onChange={(e) => onPasswordChange(e.target.value)} onBlur={onPasswordBlur}/>
                    </div>
                    {errors.password && <div className="err-msg">
                        {errors.password}
                    </div>}
                </div>
                <div className="footer">
                    <button type="submit">Submit</button>
                </div>
            </form>
        </div>
    )
}

const config = {
    fields: {
        username : {
            isRequired : "Username field is required."
        },
        password : {
            isRequired : "Password field is required.",
            isMinLength : { length: 8, message: (len: number) => `Password should be atleast ${len} characters long.` }
        }
    },
    onSubmit: (state: any) => {
		return state;
	},
    //value in showErrors could be the string "always" or an empty string ("")
	showErrors: "",
}

const WrappedForm = (): ReactElement => {
    return (
        <ValidationProvider config={config}>
            <Form/>
        </ValidationProvider>
    );
}

export default WrappedForm;