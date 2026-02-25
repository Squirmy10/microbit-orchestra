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
 * Common denominators for time signatures
 */
enum TimeSignatureDenominator {
    //% block="2"
    Half = 2,
    //% block="4"
    Quarter = 4,
    //% block="8"
    Eighth = 8,
    //% block="16"
    Sixteenth = 16
}

/**
 * Orchestral dynamic markings
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
    // State variables for the orchestra
    let currentVolume = Dynamic.MF;
    let beatsPerMeasure = 4;
    let beatValue = TimeSignatureDenominator.Quarter;

    /**
     * Sets the time signature for the orchestra (e.g., 4/4, 3/4, 6/8).
     * @param numerator the number of beats per measure
     * @param denominator the note value that receives one beat
     */
    //% block="set time signature to %numerator | / %denominator"
    //% numerator.min=1 numerator.max=16 numerator.defl=4
    //% weight=75
    export function setTimeSignature(numerator: number, denominator: TimeSignatureDenominator): void {
        beatsPerMeasure = numerator;
        beatValue = denominator;
    }

    /**
     * Sets the volume/dynamics for all notes played after this block.
     */
    //% block="set dynamic to %dynamic"
    //% weight=90
    export function setDynamic(dynamic: Dynamic): void {
        currentVolume = dynamic;
        music.setVolume(currentVolume);
    }

    /**
     * Plays a single note for a specific musical duration.
     */
    //% block="play note %note|for %duration"
    //% note.shadow="device_note"
    //% weight=100
    export function playNote(note: number, duration: NoteDuration): void {
        music.setVolume(currentVolume);
        let beatLength = 60000 / music.tempo();
        music.playTone(note, beatLength * duration);
    }

    /**
     * Pauses the playback for a specific musical duration (a rest).
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