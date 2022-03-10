# React Validator
React component to provide validations in a form.
Wrap the form component in the `ValidationProvider` exported from this module.

```jsx
import { ValidationProvider } from "@naukri-ui-dev/react-validator";
import { validationConfig } from "./config";

const WrappedForm = () => {
    return (
        <ValidationProvider config={validationConfig}>
            <Form />
        </ValidationProvider>
    );
};
```

## ValidationProvider
| Props | Required | Type |
| ------------- | ------------ | ------------ |
| config | Yes | TValidatorConfig

## TValidatorConfig
| Key | Required | Value Type |
| ------------- | ------------ | ------------ |
| fields | Yes | `TFieldConfig`
| onSubmit | Yes | `(context: any) => void;`
| showErrors| Yes | `string`
| generalErrorFields | No | `string[]` (a string being the field for which general error is to be shown)
| customValidators | No | `TFieldConfig`

# Usage
- Set the validation state of a field using `setFieldValue` function. 
- Read the computed errors (if any) from the validtor using `errors` object.

```jsx
//inside the Form component
import { useValidationStore } from "@naukri-ui-dev/react-validator";

const Form = () => {
    const {
       errors,                //object to read errors
       setFieldValue          //function to set validator state
    } = useValidationStore();
    
    const onUsernameChange = (val: string) => {
        //set the local state
        ...
        //set the validator state
        setFieldValue("username", val);
    }
    
    const onPasswordChange = (value: string) => {
        //set the local state
        ...
        //set the validator state
        setFieldValue("password", value);
    }
    
    return (
        <form>
            <div>
                <input
                    onChange={(e) => onUsernameChange(e.target.value)} 
                    placeholder="Username"
                />
                {errors.username && (<div className="err-msg">{errors.username}</div>)}
            </div>
            <div>
                 <input 
                    onChange={(e) => onPasswordChange(e.target.value)} 
                    placeholder="Password"
                />
                {errors.password && (<div className="err-msg">{errors.password}</div>)}
            </div>
           
            <button type="submit"> 
                Submit 
            </button>
        </form>
    );
};
```

# Demo
- Clone the repo on your system
- Open terminal and navigate to the cloned location
- Do `npm i` and then `npm start`
- You could see a demo form utilizing React Validator on [localhost](http://localhost:9000) 
