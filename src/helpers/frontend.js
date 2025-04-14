
export const limitText = (text,limit = 500) => {
    let newText = text;
    if(text && text.length >= limit){
        newText = text.substring(0,limit);
    }
    return newText;
}
export const remaingLimit = (text,limit = 500) => {
    let count = (limit - (text ? text.replace(/\r/g,'').length : 0));
    return count + ' characters left';
}
export const focusOnFeild = (name) => {
    if(document.getElementsByName(name)){
        let textbox = document.getElementsByName(name)[0];
        if(textbox){
            textbox.focus();
        }
    }
}
export const focusOnFeildUsingClassName = (name) => {
    if(document.getElementsByClassName(name)){
        let textbox = document.getElementsByClassName(name)[0];
        if(textbox){
            textbox.scrollIntoView();
        }
    }
}
export function hasValidationError(errors, field){
    if(errors.hasOwnProperty(field)){
        return errors[field] ? true : false;
    }
    return null;
}
export function validationError(errors,field,Name = null){
    if(errors.hasOwnProperty(field)){
        if(!Array.isArray(errors[field])){
            return errors[field];
        }else{
            return errors[field].toString();
        }
    }
    return null;
}

export const formatPhoneNumber = (phoneNumberString)  => {
    var cleaned = ('' +phoneNumberString).replace(/\D/g,'');
    var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
    if(match){
    var intlCode = (match[1] ? '+1 ' : '');
        return [intlCode,'(',match[2],') ',match[3],'-',match[4]].join('');
    }
    return null;
}



export  const validatedFields = (formdata , inputArray ,setErrors) => {
    const newError = {};
    let positionFocus = "";
    inputArray?.map((inputname)=>{
        var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if( inputname == "admin_email" ){
            // console.log(regex.test(formdata["email"]) , "<<regex.test(formdata]");
            if (!formdata["admin_email"] || !formdata["admin_email"].trim()) {
                newError["admin_email"] = "Admin email address required ";
                positionFocus = positionFocus || "email"
            }else if(!regex.test(formdata["admin_email"])){
                newError["admin_email"] = "Enter a valid email ";
                positionFocus = positionFocus || "admin_email"
            }
        }else if(inputname == "phone_no" || inputname == "contact_no"){
            var regex = /^[6-9]\d{9}$/;
            if (!formdata[inputname] || !formdata[inputname].trim()) {
                newError[inputname] = "Phone number is Required";
                positionFocus = positionFocus || inputname
            }else if(!regex.test(formdata[inputname]) ){
                //  console.log(formdata["phone"].length , "<<<<<<<formdata");
                newError[inputname] = "Please enter a valid number ";
                positionFocus = positionFocus || inputname
            }
        } else if (Array.isArray(formdata[inputname])) {
            // Handle array fields (e.g., `service_type`)
            if (formdata[inputname].length === 0) {
                newError[inputname] = "Please select at least one option";
                positionFocus = positionFocus || inputname;
            }
        } else{
            // console.log(formdata ,inputname ,formdata[inputname] );
            if (!formdata[inputname]) {
                newError[inputname] = "Please fill Required field";
                positionFocus = positionFocus || inputname
            }
        }
    })
  
    setErrors(newError);
    if (positionFocus) {
        focusOnFeild(positionFocus);
        return false;
    }
    return true;
}


  export  const formatCurrency = (number, currencySymbol = '₹') => {
    // Check if the input is a valid number
    if (isNaN(number) || number === undefined || number === 0) { return ''; }
    // Convert the number to a string and split it into integer and decimal parts
    const parts = parseFloat(number)?.toFixed(2)?.toString()?.split('.');
    const integerPart = parts[0];
    const decimalPart = parts[1];
    // Add commas to separate thousands
    let formattedIntegerPart = '';
    for (let i = integerPart.length - 1, j = 0; i >= 0; i--, j++) {
      formattedIntegerPart = integerPart[i] + (j > 0 && j % 3 === 0 ? ',' : '') + formattedIntegerPart;
    }
    return currencySymbol + formattedIntegerPart ;
  };

  export const getFirstErrorMessage = (errors) => {
    for (let key in errors) {
      if (errors[key].length > 0) {
        return errors[key][0]; // Return the first error message
      }
    }
    return "No errors found";
  };


  export const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return date.toLocaleDateString("en-GB", options).replace(",", "");
  };