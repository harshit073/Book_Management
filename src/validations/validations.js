// for empty body
const isValidRequest = function(reqBody){
    if(Object.keys(reqBody) == 0){
        return false
    }
    return true
}

// for general vaidation like space, typeof, trim
const isValid = function(value){
    //console.log(value)
    if(typeof value == 'null' || typeof value == 'undefined') return false
    if(typeof value == 'string' && typeof value.trim().length == 0) return false
    if (typeof value === 'number') return false
    return true
}

// const isValidTitleName =function(title){
//     const  titleRegex =/^\w++(?:[.,_:()\s-](?![.\s-])|\w++)*$/
//     return titleRegex.test(title)
// }

const isValidTitle = function(title){
    return ['Mr','Mrs','Miss'].indexOf(title) !== -1
}

const isValidName =function(name){
    const  nameRegex =/^[a-zA-Z. ]{2,30}$/
    return nameRegex.test(name)
}

const isValidMobile = function(mobile){
    const mobileRegex = /^[0]?[6789]\d{9}$/
    return mobileRegex.test(mobile)
}

const isValidEmail = function(email){
    const emailRegex = /^[a-z0-9][a-z0-9-_\.]+@([a-z]|[a-z0-9]?[a-z0-9-]+[a-z0-9])\.[a-z0-9]{2,10}(?:\.[a-z]{2,10})?$/
    return emailRegex.test(email)
}

const isValidPassword = function(password){
    const passRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,15}$/
    return passRegex.test(password)
}

const isValidISBN =function(ISBN){
    const  ISBNRegex =/^(?:ISBN(?:-1[03])?:?\ )?(?=[0-9X]{10}$|(?=(?:[0-9]+[-\ ]){3})[-\ 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[-\ ]){4})[-\ 0-9]{17}$)(?:97[89][-\ ]?)?[0-9]{1,5}[-\ ]?[0-9]+[-\ ]?[0-9]+[-\ ]?[0-9X]$/
    return ISBNRegex.test(ISBN)
}

const isValidDate= function(date){
    const dateRegex = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/
    return dateRegex.test(date)
}

module.exports = {isValidRequest, isValid,  isValidTitle, isValidName, isValidMobile, isValidEmail, isValidPassword, isValidISBN, isValidDate}