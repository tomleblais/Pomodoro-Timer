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
 * Identifiant du timer
 */
let intervalID;

const startAndResetButton = document.getElementById("start-reset-button")
const timerContainer = document.getElementById("timer-container")

startAndResetButton.addEventListener("click", e => {
    if (!isTimerStarted()) {
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
            if (breakCountdown > 0) {
                breakCountdown--
            } else {
                workCountdown = workDuration
                breakCountdown = breakDuration
            }
        }
        // Affichage du timer
        timerContainer.innerHTML = getCountdownHTML(workCountdown > 0 ? workCountdown : breakCountdown)
    }, 1000)
}

function resetTimer() {
    // Suppression du timer
    clearInterval(intervalID)
    intervalID = null
    // Réinitialisation des temps restant
    workCountdown = workDuration
    breakCountdown = breakDuration
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
function isTimerStarted() {
    return intervalID != null
}