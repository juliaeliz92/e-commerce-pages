let inputs = document.querySelectorAll('input:not([type="submit"]):not([type="button"])');

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
            dateContainer.style.display = 'block'
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
            dateContainer.style.display = 'none'
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
    const fromFlight = document.createElement('input')
    fromFlight.type = 'text'
    fromFlight.placeholder = 'city or airport'
    fromFlight.id = `from-flight-${multiCityContainer.childNodes.length + 1}`

    const fromLabel = document.createElement('label')
    fromLabel.textContent = 'From'
    fromLabel.htmlFor = fromFlight.id

    const toFlight = document.createElement('input')
    toFlight.type = 'text'
    toFlight.placeholder = 'city or airport'
    toFlight.id = `to-flight-${multiCityContainer.childNodes.length + 1}`

    const toLabel = document.createElement('label')
    toLabel.textContent = 'To'
    toLabel.htmlFor = toFlight.id

    const outBoundDate = document.createElement('input')
    outBoundDate.type = 'date'
    outBoundDate.placeholder = 'yyyy-mm-dd'
    outBoundDate.id = `outbound-date-${multiCityContainer.childNodes.length + 1}`

    const outboundDateLabel = document.createElement('label')
    outboundDateLabel.textContent = 'Outbound Date'
    outboundDateLabel.htmlFor = outBoundDate.id

    const flightContainer = document.createElement('div')
    flightContainer.id = `flight-${multiCityContainer.childNodes.length + 1}`
    flightContainer.className = 'flight-container'

    const fromInputContainer = document.createElement('div')
    fromInputContainer.className = 'input-container'
    fromInputContainer.append(fromLabel)
    fromInputContainer.append(fromFlight)

    const toInputContainer = document.createElement('div')
    toInputContainer.className = 'input-container'
    toInputContainer.append(toLabel)
    toInputContainer.append(toFlight)

    const outboundInputContainer = document.createElement('div')
    outboundInputContainer.className = 'input-container'
    outboundInputContainer.append(outboundDateLabel)
    outboundInputContainer.append(outBoundDate)

    const removeButton = document.createElement('input')
    removeButton.type = 'button'
    removeButton.value = 'remove'
    removeButton.addEventListener('click', () => {
        flightContainer.remove()
    })

    flightContainer.append(fromInputContainer)
    flightContainer.append(toInputContainer)
    flightContainer.append(outboundInputContainer)
    flightContainer.append(removeButton)

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


for(let i = 0; i < inputs.length ; i++) {
    inputs[i].CustomValidations = new CustomValidations(inputs[i])
    inputs[i].CustomValidations.validityChecks = inputValidityCheck;
    inputs[i].addEventListener('invalid', (e) => {
        e.target.setCustomValidity(CustomValidations.getInvalidities())
    })
}




let submit = document.querySelector('input[type="submit"]')
let validate = function(e) {
    e.preventDefault()
    const checkedFlightType = document.querySelector('input[type="radio"]:checked').value
    if(checkedFlightType === 'round-trip') {
        const formInputs = document.querySelectorAll('#place-container > .flight-container > .input-container > input')
        for(let i = 0; i < formInputs.length; i++) {
            formInputs[i]?.CustomValidations?.checkInput()
            console.log(formInputs[i].validity.valid)
        }
        // console.log(formInputs)
    }
    
    // return 1
}


submit.addEventListener('click', validate)