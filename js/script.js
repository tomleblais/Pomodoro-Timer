/**
 * Temps de travail en seconde (correspond à 25 min)
 */
let workDuration = 1500

/**
 * Temps de pause en seconde (correspond à 5 min)
 */
let breakDuration = 300

let workCountdown = workDuration
let breakCountdown = breakDuration

let intervalID = setInterval(() => {
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
    console.log(workCountdown > 0 ? "Travail : " + showTime(workCountdown): "Pause : " + breakCountdown)
}, 1000)
