/**
 * Temps de travail en seconde (correspond à 25 min)
 */
let workDuration = 1500

/**
 * Temps de pause en seconde (correspond à 5 min)
 */
let breakDuration = 300

/**
 * Temps de travail restant en seconde
 */
let workCountdown = workDuration

/**
 * Temps de pause restant en seconde
 */
let breakCountdown = breakDuration

/**
 * État actuel - travail (WORK) ou pause (BREAKQ)
 */
let currentState = "WORK"

/**
 * Identifiant du timer
 */
let intervalID;

const startAndResetButton = document.getElementById("start-reset-button")
const timerContainer = document.getElementById("timer-container")

const workState = document.getElementById("work-state")
const breakState = document.getElementById("break-state")

startAndResetButton.addEventListener("click", e => {
    if (!isTimerRunning()) {
        startTimer()
        startAndResetButton.textContent = "Arrêter"
    } else {
        resetTimer()
        startAndResetButton.textContent = "Lancer"
    }
})

/**
 * Lance le timer
 */
function startTimer() {
    intervalID = setInterval(() => {
        // Décompte du temps restant
        if (workCountdown > 0) {
            workCountdown--
        } else {
            currentState = "BREAK"

            if (breakCountdown > 0) {
                breakCountdown--
            } else {
                workCountdown = workDuration
                breakCountdown = breakDuration
                currentState = "WORK"
            }
        }
        // Affichage du timer et de l'état
        showTimer()
        showState()
    }, 1)
}

/**
 * Affiche le timer
 */
function showTimer() {
    if (currentState == "WORK") {
        timerContainer.innerHTML = getCountdownHTML(workCountdown)
    } else if (currentState == "BREAK") {
        timerContainer.innerHTML = getCountdownHTML(breakCountdown)
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

/**
 * Arrête le timer
 */
function resetTimer() {
    // Suppression du timer
    clearInterval(intervalID)
    intervalID = null
    // Réinitialisation des temps restant
    workCountdown = workDuration
    breakCountdown = breakDuration
    // Met à jour l'affichage du timer et de l'état
    showTimer()
    showState()
}

/**
 * 
 * @param {number} countdown Temps restant
 * @returns Temps restant en format `mm:ss`
 */
function getCountdownHTML(countdown) {
    let minutes = Math.trunc(countdown / 60)
    let seconds = Math.trunc(countdown % 60)

    let minutesString = `<span id="minutes"> ${minutes} </span>`
    let secondsString = `<span id="seconds"> ${seconds.toString().padStart(2, "0")} </span>`

    return `${minutesString} : ${secondsString}`
}

/**
 * Vérifie si le timer est lancé
 * @returns Boolean
 */
function isTimerRunning() {
    return intervalID != null
}