/**
 * Orchestra Extension for micro:bit
 * Orchestral composition with key signatures, dynamics, and radio control
 */

//% color=#ECA40D icon="\uf001" weight=100 block="Orchestra"
namespace orchestra {

    /**
     * Common Key Signatures
     */
    export enum KeySignature {
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
    export enum NoteDuration {
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
    export enum Dynamic {
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

    let currentVolume = Dynamic.MF;
    let currentKey = KeySignature.C;

    /**
     * Sets the key signature for the orchestra.
     */
    //% block="set key signature to $key"
    //% weight=85
    export function setKeySignature(key: KeySignature): void {
        currentKey = key;
    }

    /**
     * Plays a single note sequentially.
     */
    //% block="play note $note for $duration"
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
    //% block="set dynamic to $dynamic"
    //% weight=90
    export function setDynamic(dynamic: Dynamic): void {
        currentVolume = dynamic;
        music.setVolume(currentVolume);
    }

    /**
     * Pauses the playback for a specific duration.
     */
    //% block="rest for $duration"
    //% weight=80
    export function rest(duration: NoteDuration): void {
        let beatLength = 60000 / music.tempo();
        music.rest(beatLength * duration);
    }

    /**
     * Sets a precise BPM for the orchestra.
     */
    //% block="set orchestra tempo to $bpm BPM"
    //% bpm.min=40 bpm.max=240 bpm.defl=120
    //% weight=70
    export function setOrchestraTempo(bpm: number): void {
        music.setTempo(bpm);
    }

    // --- LIGHT CONTROL SECTION ---

    /**
     * Displays a progress bar on the LED grid.
     */
    //% block="show progress $current out of $total"
    //% weight=40
    export function showProgress(current: number, total: number): void {
        led.plotBarGraph(current, total);
    }

    /**
     * Adjusts LED brightness based on volume.
     */
    //% block="update brightness to volume"
    //% weight=30
    export function syncBrightness(): void {
        led.setBrightness(currentVolume);
    }

    /**
     * Plots a point on the LED grid based on pitch.
     */
    //% block="plot pitch $note"
    //% note.shadow="device_note"
    //% weight=20
    export function plotPitch(note: number): void {
        basic.clearScreen();
        let index = note % 25;
        let x = index % 5;
        let y = Math.floor(index / 5);
        led.plot(x, y);
    }

    // --- RADIO CONTROL SECTION ---

    /**
     * Sends a start signal via radio.
     */
    //% block="conductor send start signal $signal"
    //% weight=10
    export function sendStartSignal(signal: number): void {
        radio.sendNumber(signal);
    }

    /**
     * Runs code when a radio signal is received.
     */
    //% block="on conductor signal $signal received"
    //% draggableParameters="reporter"
    //% weight=5
    export function onSignalReceived(signal: number, handler: () => void): void {
        radio.onReceivedNumber(function (receivedNumber: number) {
            if (receivedNumber == signal) {
                handler();
            }
        });
    }
}