/**
 * Common Key Signatures
 */
enum KeySignature {
    //% block="C Major / A Minor"
    C = 0,
    //% block="G Major / E Minor"
    G = 1,
    //% block="F Major / D Minor"
    F = -1,
    //% block="D Major / B Minor"
    D = 2,
    //% block="Bb Major / G Minor"
    Bb = -2
}

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
    // State variables (removed multi-voice logic)
    let currentVolume = Dynamic.MF;
    let currentKey = KeySignature.C;

    /**
     * Sets the key signature for the orchestra.
     */
    //% block="set key signature to %key"
    //% weight=85
    export function setKeySignature(key: KeySignature): void {
        currentKey = key;
    }

    /**
     * Plays a single note sequentially. Multi-voice features have been removed.
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
     * Sets the dynamics for subsequent notes.
     */
    //% block="set dynamic to %dynamic"
    //% weight=90
    export function setDynamic(dynamic: Dynamic): void {
        currentVolume = dynamic;
        music.setVolume(currentVolume);
    }

    // --- LIGHT CONTROL SECTION ---

    /**
     * Displays a progress bar on the LED grid based on song completion.
     */
    //% block="show progress %current out of %total"
    //% weight=40
    export function showProgress(current: number, total: number): void {
        led.plotBarGraph(current, total); // Uses built-in LED bar graph logic [4, 5]
    }

    /**
     * Adjusts LED brightness based on the current orchestral volume.
     */
    //% block="update brightness to volume"
    //% weight=30
    export function syncBrightness(): void {
        led.setBrightness(currentVolume); // Maps current volume (0-255) to brightness [4, 5]
    }

    /**
     * Plots a point on the LED grid based on the pitch of the note.
     */
    //% block="plot pitch %note"
    //% note.shadow="device_note"
    //% weight=20
    export function plotPitch(note: number): void {
        basic.clearScreen();
        // Simple mapping: index = note % 25 to fit on 5x5 grid
        let index = note % 25;
        let x = index % 5;
        let y = Math.floor(index / 5);
        led.plot(x, y); // Plots coordinates on the micro:bit screen [4-6]
    }
}