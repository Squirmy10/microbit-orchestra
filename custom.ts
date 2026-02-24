/**
 * Musical notation durations
 */
enum NoteDuration {
    //% block="whole"
    Whole = 4,
    //% block="half"
    Half = 2,
    //% block="quarter"
    Quarter = 1,
    //% block="eighth"
    Eighth = 0.5,
    //% block="sixteenth"
    Sixteenth = 0.25
}

/**
 * Orchestral dynamic markings (mapped to volume 0-255)
 */
enum Dynamic {
    //% block="pp"
    PP = 45,
    //% block="p"
    P = 80,
    //% block="mf"
    MF = 130,
    //% block="f"
    F = 180,
    //% block="ff"
    FF = 255
}

//% color=#ECA40D icon="\uf001" weight=100
namespace Orchestra {

    /**
     * Plays a note with specific duration and dynamics.
     * @param note pitch of the note
     * @param duration musical duration
     * @param volume loudness marking
     */
    //% block="play note %note|for %duration|at %volume"
    //% note.shadow="device_note"
    export function playOrchestraNote(note: number, duration: NoteDuration, volume: Dynamic): void {
        music.setVolume(volume);
        // Calculate milliseconds based on current BPM (60000ms / BPM = 1 beat)
        let beatLength = 60000 / music.tempo();
        music.playTone(note, beatLength * duration);
    }

    /**
     * Sets a precise BPM for the orchestra.
     */
    //% block="set orchestra tempo to %bpm|BPM"
    //% bpm.min=40 bpm.max=240 bpm.defl=120
    export function setOrchestraTempo(bpm: number): void {
        music.setTempo(bpm);
    }

    /**
     * Sends a start signal to all micro:bits in the orchestra.
     */
    //% block="conductor: send start signal %signal"
    export function sendStartSignal(signal: number): void {
        radio.sendNumber(signal);
    }

    /**
     * Runs code when the conductor's start signal is received.
     */
    //% block="on conductor signal %signal received"
    export function onSignalReceived(signal: number, handler: () => void): void {
        radio.onReceivedNumber(function (receivedNumber: number) {
            if (receivedNumber == signal) {
                handler();
            }
        });
    }
}
