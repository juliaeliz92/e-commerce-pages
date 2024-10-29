let roundTripInput = document.getElementById('round-trip')
let toPlaceInputContainer = document.getElementById('to-place-container')
let addFlightButtonContainer = document.getElementById('add-flight-container')
let multiCityContainer = document.getElementById('multi-city-container')
let returningDateContainer = document.getElementById('returning-date-container')
let addFlightButton = document.getElementById('add-flight-button')
let radioInputs = document.querySelectorAll('input[type="radio"]')
let placeContainer = document.getElementById('place-container')
let dateContainer = document.getElementById('date-container')

let checkRadioInput = (input) => {
    if(input.checked) {
        if(input.id === 'round-trip' || input.id === 'one-way') {
            addFlightButtonContainer.style.display = 'none'
            multiCityContainer.style.display = 'none'
            placeContainer.style.display = 'block'
        } 

        if(input.id === 'round-trip' || input.id === 'multi-city') {
            returningDateContainer.style.display = 'block'
        }
        
        if(input.id === 'one-way') {
            returningDateContainer.style.display = 'none'
        } 

        if(input.id === 'multi-city') {
            addFlightButtonContainer.style.display = 'block'
            multiCityContainer.style.display = 'block'
            placeContainer.style.display = 'none'
        }
    }
}

for(let i = 0; i < radioInputs.length; i++) {
    radioInputs[i].addEventListener('change', function() {
        checkRadioInput(radioInputs[i])
    })
}

checkRadioInput(radioInputs[0])

addFlightButton.addEventListener('click', () => {
    const inputs = [
        {
            type: 'text',
            placeholder: 'city or airport',
            id : `from-flight-${multiCityContainer.children.length + 1}`,
            label: 'from',
            errorId: `from-flight-${multiCityContainer.children.length + 1}-error`
        }, 
        {
            type: 'text',
            placeholder: 'city or airport',
            id : `to-flight-${multiCityContainer.children.length + 1}`,
            label: 'to',
            errorId: `to-flight-${multiCityContainer.children.length + 1}-error`
        },
        {
            type: 'date',
            placeholder: 'yyyy-mm-dd',
            id : `outbound-date-${multiCityContainer.children.length + 1}`,
            label: 'outbound date',
            errorId: `outbound-date-${multiCityContainer.children.length + 1}-error`
        }
    ]

    const flightContainer = document.createElement('div')
    flightContainer.id = `flight-${multiCityContainer.children.length + 1}`
    flightContainer.className = 'flight-container d-md-flex'

    inputs.map(input => {
        let element = document.createElement('input')
        element.type = input.type
        element.placeholder = input.placeholder
        element.id = input.id

        let label = document.createElement('label')
        label.textContent = input.label
        label.htmlFor = input.id

        let inputControl = document.createElement('div')
        inputControl.className = 'input-control'

        inputControl.append(label)
        inputControl.append(element)

        let inputContainer = document.createElement('div')
        inputContainer.className = 'input-container mx-1'
        inputContainer.append(inputControl)

        let spanError = document.createElement('span')
        spanError.id = input.errorId

        inputContainer.append(spanError)
        flightContainer.append(inputContainer)
    })
    
    
    const removeButton = document.createElement('button')
    const removeIcon = document.createElement('i')
    removeIcon.className = 'bi bi-x'
    removeButton.className = 'remove-button'
    removeButton.append(removeIcon)
    removeButton.addEventListener('click', () => {
        flightContainer.remove()
    })

    const removeButtonContainer = document.createElement('div')
    removeButtonContainer.append(removeButton)

    flightContainer.append(removeButtonContainer)
    multiCityContainer.append(flightContainer)
})

const prefixDate = (date) => {
    return date < 10 ? `0${date}` : date
} 

const formatToday = `${new Date().getFullYear()}-${prefixDate(new Date().getMonth() + 1)}-${prefixDate(new Date().getDate())}`

const departingDateInput = document.getElementById('departing-date')
departingDateInput.min = formatToday

const returningDateInput = document.getElementById('returning-date')
returningDateInput.min = formatToday

departingDateInput.addEventListener('change', () => {
    let nextDay = moment().add(1, 'd')
    returningDateInput.min = `${nextDay.year()}-${prefixDate(nextDay.month() + 1)}-${prefixDate(nextDay.date())}`
})

const setDateValidity = (id) => {
    const dateInputs = document.querySelectorAll(`#${id} input[type="date"]`)
    for(let i = 0; i <= dateInputs.length - 1; i++) {
        dateInputs[i].min = formatToday
    }
}
setDateValidity('multi-city-container')

const setPassengerStepperValidity = (passenger) => {
    const button =  document.querySelector(`input[type="button"]#${passenger}-passenger-remove`)
    const passengerCount = document.querySelector(`span#${passenger}-passenger-count`)
    const count = parseInt(passengerCount.textContent)
    if(count === 0) {
        button.disabled = true
    }
}
 
setPassengerStepperValidity('adult')
setPassengerStepperValidity('children')

const setPassengerStepperClick = (passenger) => {
    const buttons =  document.querySelectorAll(`input[type="button"][id^="${passenger}-passenger-"]`)
    const passengerCount = document.querySelector(`span[id^=${passenger}-passenger-count]`)
    let count = parseInt(passengerCount.textContent)
    for(let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener('click', () => {
            if(buttons[i].value === '+') {
                count++
                if(count > 0) {
                    buttons[0].disabled = false
                }
            } else {
                count--
                if(count === 0) {
                    buttons[0].disabled = true
                }
            }
            passengerCount.innerHTML = count
        })
    }
}
setPassengerStepperClick('adult')
setPassengerStepperClick('children')


let CustomValidations = function(input) {
    this.invalidities = [];
    this.inputNode = input;
    this.validityChecks = [];
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
            if(isInvalid) {
                this.addInvalidity(this.validityChecks[i].invalidityMessage)

            }
        }
    },
    checkInput: function() {
        this.inputNode.CustomValidations.invalidities = []
        this.checkValidity(this.inputNode)
        if(this.inputNode.CustomValidations.invalidities.length === 0 && this.inputNode.value !== '') {
            this.inputNode.setCustomValidity('')
            document.querySelector(`span[id='${this.inputNode.id}-error']`).innerHTML = null
        } else {
            let message = this.inputNode.CustomValidations.getInvalidities();
            this.inputNode.setCustomValidity(message)
            document.querySelector(`span[id='${this.inputNode.id}-error']`).innerHTML = message
        }
    },

}

let inputValidityCheck = [
    { 
        isInvalid: function(input) {
            return input.value?.length === 0
        },
        invalidityMessage: 'The field is required!',
    },
]


let submit = document.querySelector('input[type="submit"]')
let validate = function(e) {
    e.preventDefault()
    let inputs = document.querySelectorAll('input:not([type="submit"]):not([type="button"]):not([type="radio"])');
    for(let i = 0; i < inputs.length; i++) {
        if(inputs[i].offsetWidth > 0 && inputs[i].offsetHeight > 0) {
            inputs[i].CustomValidations = new CustomValidations(inputs[i])
            inputs[i].CustomValidations.validityChecks = inputValidityCheck;
            inputs[i].addEventListener('invalid', (e) => {
                e.target.setCustomValidity(CustomValidations.getInvalidities())
            })
            inputs[i]?.CustomValidations?.checkInput()
        }
    }
    let passengerSpans = document.querySelectorAll('span[id$="-passenger-count"]')
    let passengerCount = 0
    for(let i = 0; i < passengerSpans.length; i++) {
        passengerCount += parseInt(passengerSpans[i].textContent)
    }
    if(passengerCount === 0) {
        document.querySelector('span[id="passenger-error"').innerHTML = 'Passenger count should not be zero!'
    } else {
        document.querySelector('span[id="passenger-error"').innerHTML = ''
    }
}


submit.addEventListener('click', validate)