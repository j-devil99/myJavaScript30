const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');
const fullscreenButton = player.querySelector('.fullscreen');

function togglePlay(){
    if(video.paused){
        video.play();
    }else {
        video.pause();
    }
}

function updateButton(){
    if(video.paused){
        toggle.textContent = '►';
    }else {
        toggle.textContent = '❚❚';
    }
}

function skip(){
    video.currentTime += parseFloat(this.dataset.skip);
}

function controls(){
    video[this.name] = this.value;
}

function handleProgress(){
    const percent = (video.currentTime/video.duration) * 100;
    progressBar.style.flexBasis = `${percent}%`;
}

function seek(e){
    const seekTime = (e.offsetX / progress.offsetWidth) * video.duration;
    video.currentTime = seekTime;
    console.log(mousedown);
}

function fullscreen(){
    video.requestFullscreen();
}

video.addEventListener('click', togglePlay);
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);
video.addEventListener('timeupdate', handleProgress);
toggle.addEventListener('click', togglePlay);
skipButtons.forEach(button => {
    button.addEventListener('click', skip);
});
ranges.forEach(range => {
    range.addEventListener('change', controls);
});
ranges.forEach(range => {
    range.addEventListener('mousemove', controls);
});
let mousedown = false;
progress.addEventListener('click', seek);
progress.addEventListener('mousemove', (e) => mousedown && seek(e));
progress.addEventListener('mousedown', ()=> mousedown = true);
progress.addEventListener('mouseup', ()=> mousedown = false);
fullscreenButton.addEventListener('click', fullscreen);