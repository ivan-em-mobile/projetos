const resetBtn = document.querySelector('#reset');
const playBtn = document.querySelector('#play');
const timerEl = document.querySelector('#timer');
const root = document.querySelector(':root');
const timerEndSound = document.querySelector('#timerEndSound'); // Adicionamos esta linha

// Initial setup
const totalSeconds = 60;
let playing = false;
let currentSeconds = totalSeconds;
timerEl.innerText = formatTime(totalSeconds);

let timerInterval; // Declaramos timerInterval fora do setInterval para poder limpá-lo

playBtn.addEventListener('click', () => {
    playing = !playing;
    playBtn.classList.toggle('play');
    playBtn.classList.toggle('bg-green-500');
    const playIcon = playBtn.querySelector('i');
    playIcon.classList.toggle('fa-play');
    playIcon.classList.toggle('fa-pause');

    if (playing && !timerInterval) { // Inicia o intervalo apenas se estiver tocando e não estiver ativo
        timerInterval = setInterval(run, 1000);
    } else if (!playing && timerInterval) { // Limpa o intervalo se pausar
        clearInterval(timerInterval);
        timerInterval = null;
    }
});

resetBtn.addEventListener('click', resetAll);

// Run the timer
function run() {
    if (playing) {
        currentSeconds -= 1;
        if (currentSeconds <= 0) {
            clearInterval(timerInterval);
            timerInterval = null; // Limpamos a variável do intervalo
            resetAll();
            playSound(); // Chamamos a função para tocar o som
        }

        timerEl.innerText = formatTime(currentSeconds);
        root.style.setProperty('--degrees', calcDeg());
    }
}

// Format the time
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const newSeconds = seconds % 60;

    return `${minutes.toString().padStart(2, '0')}:${newSeconds
        .toString()
        .padStart(2, '0')}`;
}

// Calculate the degrees
function calcDeg() {
    return `${360 - (currentSeconds / totalSeconds) * 360}deg`;
}

// Reset all the values
function resetAll() {
    playing = false;
    playBtn.classList.remove('play');
    playBtn.classList.remove('bg-green-500');
    const playIcon = playBtn.querySelector('i');
    playIcon.classList.remove('fa-pause');
    playIcon.classList.add('fa-play');
    currentSeconds = totalSeconds;
    timerEl.innerText = formatTime(totalSeconds);
    root.style.setProperty('--degrees', '0deg');
}

// Function to play the sound
function playSound() {
    if (timerEndSound) {
        timerEndSound.currentTime = 0; // Reinicia o som para permitir reprodução rápida
        timerEndSound.play();
    }
}