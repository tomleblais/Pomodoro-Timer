/**
 * Temps de travail en seconde (correspond à 25 min)
 */
let workDuration = parseInt(localStorage.getItem("work-duration")) || 1500

/**
 * Temps de pause en seconde (correspond à 5 min)
 */
let breakDuration = parseInt(localStorage.getItem("break-duration")) || 300

/**
 * Temps de travail restant en seconde
 */
let workCountdown = workDuration

/**
 * Temps de pause restant en seconde
 */
let breakCountdown = breakDuration

/**
 * État actuel - travail (WORK) ou pause (BREAK)
 */
let currentState = "WORK"

/**
 * Identifiant du timer
 */
let intervalID;

const startAndResetButton = document.getElementById("start-reset-button")
const timerContainer = document.getElementById("timer-container")

const minutesSpan = document.getElementById("minutes")
const secondsSpan = document.getElementById("seconds")

const workState = document.getElementById("work-state")
const breakState = document.getElementById("break-state")

const workDurationConfigInput = document.getElementById("work-duration-config-input")
const breakDurationConfigInput = document.getElementById("break-duration-config-input")

const durationConfigContainer = document.getElementById("duration-config-container")

window.addEventListener("load", e => {
    workDurationConfigInput.value = parseInt(workDuration / 60)
    breakDurationConfigInput.value = parseInt(breakDuration / 60)
    updateCountdown(workCountdown)
    refreshCanvas(0)
})

workDurationConfigInput.addEventListener("change", e => {
    workDuration = workDurationConfigInput.value * 60
    localStorage.setItem("work-duration", workDuration)
    resetTimer()
    showTimer()
    refreshCanvas(0)
})

breakDurationConfigInput.addEventListener("change", e => {
    breakDuration = breakDurationConfigInput.value * 60
    localStorage.setItem("break-duration", breakDuration)
    resetTimer()
    showTimer()
    refreshCanvas(1)
})

startAndResetButton.addEventListener("click", e => {
    if (!isTimerRunning()) {
        startTimer()
        startAndResetButton.innerHTML = `<i class="fa-solid fa-rotate-left" style="color: #005fdc;"></i>`
    } else {
        resetTimer()
        startAndResetButton.innerHTML = `<i class="fa-solid fa-play" style="color: #005fdc;"></i>`
    }
})

/**
 * Lance le timer
 */
function startTimer() {
    hideConfig()
    refreshCanvas(1)
    intervalID = setInterval(function () {
        // Décompte du temps restant
        if (workCountdown > 0) {
            workCountdown--
        } else {
            currentState = "BREAK"

            if (breakCountdown == breakDuration)
                beep()

            if (breakCountdown > 0) {
                breakCountdown--
            } else {
                currentState = "WORK"
                beep()

                workCountdown = workDuration
                breakCountdown = breakDuration
            }
        }
        // Affichage du timer
        showTimer()
        // Affichage de l'état
        showState()
        // Affichage du tournant
        let percent = currentState == "WORK" ? workCountdown / workDuration : breakCountdown / breakDuration
        refreshCanvas(percent)
    }, 1)
}

/**
 * Arrête le timer
 */
function resetTimer() {
    // Suppression du timer
    clearInterval(intervalID)
    intervalID = null
    // Remet l'état à travail
    currentState = "WORK"
    // Réinitialisation des temps restant
    workCountdown = workDuration
    breakCountdown = breakDuration
    // Met à jour l'affichage du timer et de l'état
    showTimer()
    showState()
    showConfig()
    refreshCanvas(1)
}

/**
 * Affiche le timer
 */
function showTimer() {
    if (currentState == "WORK") {
        updateCountdown(workCountdown)
    } else if (currentState == "BREAK") {
        updateCountdown(breakCountdown)
    }
}

/**
 * Met à jour l'affichage de l'état
 */
function showState() {
    if (currentState == "WORK") {
        workState.classList.add("selected")
        breakState.classList.remove("selected")
    } else if (currentState == "BREAK") {
        workState.classList.remove("selected")
        breakState.classList.add("selected")
    }
}

/** Arc entourant le timer **/
const canvas = document.getElementById("timer-canvas")
const context = canvas.getContext("2d")

const centerX = canvas.width / 2
const centerY = canvas.height / 2
const radius = 102.5

/**
 * Dessine un arc autour du timer en fonction du temps écoulé
 * @param {number} percent Pourcentage de temps écoulé
 */
function drawCanvas(percent) {
    let startAngle = (-1 / 2) * Math.PI
    let endAngle = startAngle + ((1 - percent) * 2) * Math.PI
    let counterClockwise = true

    // bar bleue
    context.beginPath()
    context.arc(centerX, centerY, radius, endAngle, startAngle, counterClockwise)
    context.lineWidth = 5
    context.strokeStyle = "#0060df"
    context.stroke()
    // bar grise
    context.beginPath()
    context.arc(centerX, centerY, radius, startAngle, endAngle, counterClockwise)
    context.lineWidth = 5
    context.strokeStyle = "#cccccc"
    context.stroke()
}

/**
 * Efface le canvas
 */
function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height)
}

/**
 * Met à jour le canvas
 * @param {number} percent Pourcentage de temps écoulé
 */
function refreshCanvas(percent) {
    clearCanvas()
    drawCanvas(percent)
}

/**
 * Met à jour le compteur dans le HTML à partir d'un temps écoulé
 * @param {number} countdown Temps écoulé (en ms)
 */
function updateCountdown(countdown) {
    let minutes = Math.trunc(countdown / 60)
    let seconds = Math.trunc(countdown % 60)

    minutesSpan.textContent = minutes.toString().padStart(2, "0")
    secondsSpan.textContent = seconds.toString().padStart(2, "0")
}

/**
 * Vérifie si le timer est lancé
 * @returns Boolean
 */
function isTimerRunning() {
    return intervalID != null
}

/**
 * Cache le formulaire de configuration des durées
 */
function hideConfig() {
    workDurationConfigInput.disabled = true
    breakDurationConfigInput.disabled = true
}

/**
 * Affiche le formulaire de configuration des durées
 */
function showConfig() {
    workDurationConfigInput.disabled = false
    breakDurationConfigInput.disabled = false
}

/**
 * Emet un beep!
 */
function beep() {
    let audio = new Audio('https://assets.mixkit.co/active_storage/sfx/951/951-preview.mp3')
    audio.play()
        .then(console.log)
        .catch(console.log)
}