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
    // Internal variable to store the dynamic state (volume)
    // MF is the standard default for orchestra starts
    let currentVolume = Dynamic.MF;

    /**
     * Sets the volume/dynamics for all notes played after this block.
     * @param dynamic the dynamic marking (pp to ff)
     */
    //% block="set dynamic to %dynamic"
    //% weight=90
    export function setDynamic(dynamic: Dynamic): void {
        currentVolume = dynamic;
        music.setVolume(currentVolume);
    }

    /**
     * Plays a single note for a specific musical duration using the current dynamic level.
     * @param note pitch of the note to play
     * @param duration musical length (whole to sixteenth)
     */
    //% block="play note %note|for %duration"
    //% note.shadow="device_note"
    //% weight=100
    export function playNote(note: number, duration: NoteDuration): void {
        // Re-apply current volume in case other modules changed it
        music.setVolume(currentVolume);
        let beatLength = 60000 / music.tempo();
        music.playTone(note, beatLength * duration);
    }

    /**
     * Pauses the playback for a specific musical duration (a rest).
     * @param duration musical length of the rest
     */
    //% block="rest for %duration"
    //% weight=80
    export function rest(duration: NoteDuration): void {
        let beatLength = 60000 / music.tempo();
        music.rest(beatLength * duration);
    }

    /**
     * Sets a precise BPM for the orchestra.
     */
    //% block="set orchestra tempo to %bpm|BPM"
    //% bpm.min=40 bpm.max=240 bpm.defl=120
    //% weight=70
    export function setOrchestraTempo(bpm: number): void {
        music.setTempo(bpm);
    }

    /**
     * Sends a start signal to all micro:bits in the orchestra.
     */
    //% block="conductor: send start signal %signal"
    //% weight=60
    export function sendStartSignal(signal: number): void {
        radio.sendNumber(signal);
    }

    /**
     * Runs code when the conductor's start signal is received.
     */
    //% block="on conductor signal %signal received"
    //% weight=50
    export function onSignalReceived(signal: number, handler: () => void): void {
        radio.onReceivedNumber(function (receivedNumber: number) {
            if (receivedNumber == signal) {
                handler();
            }
        });
    }
}