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
    let currentVolume = Dynamic.MF;
    let lastDuration = 0;
    let pendingTieDuration = 0;

    /**
     * Ties the duration of the previous note to the next note played.
     */
    //% block="tie to next note"
    //% weight=95
    export function tieToNextNote(): void {
        pendingTieDuration = lastDuration;
    }

    /**
     * Plays a single note. If tied, it adds the previous duration to this one.
     */
    //% block="play note %note|for %duration"
    //% note.shadow="device_note"
    //% weight=100
    export function playNote(note: number, duration: NoteDuration): void {
        music.setVolume(currentVolume);

        // Combine this duration with any pending tie
        let totalMusicalDuration = duration + pendingTieDuration;

        // Save this duration in case the user wants to tie the NEXT note
        lastDuration = duration;
        pendingTieDuration = 0; // Reset after use

        let beatLength = 60000 / music.tempo();
        music.playTone(note, beatLength * totalMusicalDuration);
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
     * Pauses the playback for a specific musical duration (a rest).
     */
    //% block="rest for %duration"
    //% weight=80
    export function rest(duration: NoteDuration): void {
        pendingTieDuration = 0; // A rest breaks a tie
        let beatLength = 60000 / music.tempo();
        music.rest(beatLength * duration);
    }

    /**
     * Sets the time signature for the orchestra.
     */
    //% block="set time signature to %numerator | / %denominator"
    //% numerator.min=1 numerator.max=16 numerator.defl=4
    //% weight=75
    export function setTimeSignature(numerator: number, denominator: TimeSignatureDenominator): void {
        // Time signature logic
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
     * Conductor and Radio blocks follow...
     */
}