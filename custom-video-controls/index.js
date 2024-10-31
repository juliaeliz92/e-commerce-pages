const buttons = document.querySelectorAll('button')
const media = document.querySelector('#media')
const rail = document.querySelector('#video-seek-rail')
const fill = document.querySelector('#video-seek-fill')

for(let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', (e) => {
        if(e.target.id === 'play') {
            media.play()
        } else {
            media.pause()
        }
    })
}

rail.addEventListener('click', seekTime)

const seekTime = (e) => {
    media.currentTime = e.offsetX / rail.offsetWidth * media.duration;
}