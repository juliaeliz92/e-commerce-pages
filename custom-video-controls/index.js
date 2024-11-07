const buttons = document.querySelectorAll('button')
const media = document.querySelector('#media')
const rail = document.querySelector('#video-seek-rail')
const fill = document.querySelector('#video-seek-fill')
const timeLeft = document.querySelector('#time-left')
const duration = document.querySelector('#time-duration')

for(let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', (e) => {
        if(e.target.id === 'play') {
            media.play()
        } else {
            media.pause()
        }
    })
}

const seekTime = (e) => {
    media.currentTime = e.offsetX / rail.offsetWidth * media.duration;
}

const appendZero = (time) => {
    return time >= 10 ? time : `0${time}`
}

const displayTime = () => {
    const secLeft = (media.currentTime).toFixed(0)
    const minLeft = (media.currentTime / 60).toFixed(0)
    const secDuration = (media.duration).toFixed(0)
    const minDuration = (media.duration / 60).toFixed(0)
    timeLeft.innerHTML = `${appendZero(minLeft)} : ${appendZero(secLeft)}`
    duration.innerHTML = `${appendZero(minDuration)} : ${appendZero(secDuration)}`
}

const updateTime = () => {
    let currentLength = rail.clientWidth * (media.currentTime / media.duration)
    fill.style.width = `${currentLength}px`
    displayTime(media.currentTime)
}

rail.addEventListener('click', seekTime)
fill.addEventListener('click', seekTime)
media.addEventListener('loadedmetadata', updateTime)
media.addEventListener('timeupdate', updateTime)