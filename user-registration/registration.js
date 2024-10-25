let inputs = document.querySelectorAll('input:not([type="submit"])');
inputs.forEach(input => {
    input.addEventListener('focusout', (e) => {
        if(e.target.validity.valid) {
            input.classList.remove('invalid')
        } else {
            input.classList.add('invalid')
        }
    })
})

let CustomValidations = function(input) {
    this.invalidities = [];
    this.inputNode = input;
    this.validityChecks = [];
    this.registerListener();
}

CustomValidations.prototype = {
    addInvalidity: function(msg) {
        this.invalidities.push(msg)
    },
    getInvalidities: function() {
        return this.invalidities.join('./n')
    },
    checkValidity: function(input) {
        for(var i = 0; i < this.validityChecks.length; ++i) {
            let isInvalid = this.validityChecks[i].isInvalid(input);
            let requirementElement = this.validityChecks[i].element;
            if(isInvalid) {
                this.addInvalidity(this.validityChecks[i].invalidityMessage)
                requirementElement?.classList.add('invalid')
                requirementElement?.classList.remove('valid')
            } else {
                requirementElement?.classList.add('valid')
                requirementElement?.classList.remove('invalid')
            }
        }
    },
    checkInput: function() {
        this.inputNode.CustomValidations.invalidities = []
        this.checkValidity(this.inputNode)
        if(this.inputNode.CustomValidations.invalidities.length === 0 && this.inputNode.value !== '') {
            this.inputNode.setCustomValidity('')
        } else {
            let message = this.inputNode.CustomValidations.getInvalidities();
            this.inputNode.setCustomValidity(message)
        }
    },
    registerListener: function() {
        var CustomValidations = this;
        this.inputNode.addEventListener('keyup', function() {
            CustomValidations.checkInput()
        })
    }
}

let passwordValidityChecks = [
    { 
        isInvalid: function(input) {
            return input.value.length < 8 || input.value.length > 100;
        },
        invalidityMessage: 'This input needs to be between 8 and 100',
        element: document.querySelector('input#pswd1 + .requirements li:first-child')
    },
    { 
        isInvalid: function(input) {
            return !/[0-9]/.test(input.value)
        },
        invalidityMessage: 'This input should contain at least one number',
        element: document.querySelector('input#pswd1 + .requirements li:nth-child(2)')
    },
    { 
        isInvalid: function(input) {
            return !/[-’/`~!#*$@_%+=.,^&(){}[\]|;:”<>?\\]/g.test(input.value)
        },
        invalidityMessage: 'This input should contain at least one special character',
        element: document.querySelector('input#pswd1 + .requirements li:nth-child(3)')
    },
    { 
        isInvalid: function(input) {
            return !/[A-Z]/.test(input.value)
        },
        invalidityMessage: 'This input should contain at least one uppercase character',
        element: document.querySelector('input#pswd1 + .requirements li:nth-child(4)')
    },
    { 
        isInvalid: function(input) {
            return !/[a-z]/.test(input.value)
        },
        invalidityMessage: 'This input should contain at least one lowercase character',
        element: document.querySelector('input#pswd1 + .requirements li:last-child')
    },
]

let secondPasswordValidityCheck = [
    { 
        isInvalid: function(input) {
            return document.getElementById('pswd1').value !== input.value
        },
        invalidityMessage: 'The passwords should match',
        element: document.querySelector('input#pswd2 + .requirements li')
    },
]

let password = document.getElementById('pswd1')
password.CustomValidations = new CustomValidations(password)
password.CustomValidations.validityChecks = passwordValidityChecks;

let password2 = document.getElementById('pswd2')
password2.CustomValidations = new CustomValidations(password2)
password2.CustomValidations.validityChecks = secondPasswordValidityCheck;

let submit = document.querySelector('input[type="submit"]')
let validate = function() {
    for(let i = 0; i < inputs.length; i++) {
        inputs[i].CustomValidations.checkInput();
    }
    document.querySelector('form').reportValidity()
}

submit.addEventListener('click', validate)