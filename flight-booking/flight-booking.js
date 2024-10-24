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
    addInvalidities: function(message) {
        this.invalidities.push(message)
    },
    getInvalidities: function() {
        return this.invalidities.join('\n')
    },
    checkValidity: function(input) {
        for(let i = 0; i < this.validityChecks.length; i++) {
            let isInvalid = this.validityChecks[i].isInvalid(input)
            let requiredElement = this.validityChecks[i].element
            if(isInvalid) {
                this.addInvalidity(this.validityChecks[i].invalidityMessage)
                requiredElement.classList.add('invalid')
                requiredElement.classList.remove('invalid')
            } else {
                requiredElement.classList.remove('invalid')
                requiredElement.classList.add('invalid')
            }
        }
    },
    checkInput: function() {
        this.inputNode.invalidities = []
        this.checkValidity(this.inputNode)
        if(this.inputNode.CustomValidations.invalidities.length === 0 && this.inputNode.value !== '') {
            this.inputNode.setCustomValidity('')
        } else {
            let message = this.inputNode.CustomValidations.getInvalidities()
            this.inputNode.setCustomValidity(message)
        }
    },
    registerListener: function() {
        let CustomValidations = this
        this.inputNode.addEventListener('keyup', function() {
            CustomValidations.checkInput()
        })
    }
}

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
    let fromFlight = document.createElement('input')
    fromFlight.type = 'text'
    fromFlight.placeholder = 'city or airport'
    fromFlight.id = `from-flight-${multiCityContainer.childNodes.length + 1}`

    let fromLabel = document.createElement('label')
    fromLabel.textContent = 'From'
    fromLabel.htmlFor = fromFlight.id

    let toFlight = document.createElement('input')
    toFlight.type = 'text'
    toFlight.placeholder = 'city or airport'
    toFlight.id = `to-flight-${multiCityContainer.childNodes.length + 1}`

    let toLabel = document.createElement('label')
    toLabel.textContent = 'To'
    toLabel.htmlFor = toFlight.id

    let outBoundDate = document.createElement('input')
    outBoundDate.type = 'date'
    outBoundDate.placeholder = 'yyyy-mm-dd'
    outBoundDate.id = `outbound-date-${multiCityContainer.childNodes.length + 1}`

    let outboundDateLabel = document.createElement('label')
    outboundDateLabel.textContent = 'Outbound Date'
    outboundDateLabel.htmlFor = outBoundDate.id

    let flightContainer = document.createElement('div')
    flightContainer.id = `flight-${multiCityContainer.childNodes.length + 1}`
    flightContainer.className = 'flight-container'

    let fromInputContainer = document.createElement('div')
    fromInputContainer.className = 'input-container'
    fromInputContainer.append(fromLabel)
    fromInputContainer.append(fromFlight)

    let toInputContainer = document.createElement('div')
    toInputContainer.className = 'input-container'
    toInputContainer.append(toLabel)
    toInputContainer.append(toFlight)

    let outboundInputContainer = document.createElement('div')
    outboundInputContainer.className = 'input-container'
    outboundInputContainer.append(outboundDateLabel)
    outboundInputContainer.append(outBoundDate)

    flightContainer.append(fromInputContainer)
    flightContainer.append(toInputContainer)
    flightContainer.append(outboundInputContainer)

    multiCityContainer.append(flightContainer)
})

// let submit = document.querySelector('input[type="submit"]')
let validate = function() {
    for(let i = 0; i < inputs.length; i++) {
        inputs[i].CustomValidations.checkInput();
    }
}

// submit.addEventListener('click', validate)