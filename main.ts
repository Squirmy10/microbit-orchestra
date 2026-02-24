/**
 * Orchestra Extension for micro:bit
 * Full orchestral composition with BPM, dynamics, and synchronization
 */

//% color=#FF6F00 weight=100 icon="\uf001" block="Orchestra"
namespace orchestra {
    
    export enum Note {
        //% block="C2"
        C2 = 65,
        //% block="C#2"
        Cs2 = 69,
        //% block="D2"
        D2 = 73,
        //% block="D#2"
        Ds2 = 78,
        //% block="E2"
        E2 = 82,
        //% block="F2"
        F2 = 87,
        //% block="F#2"
        Fs2 = 93,
        //% block="G2"
        G2 = 98,
        //% block="G#2"
        Gs2 = 104,
        //% block="A2"
        A2 = 110,
        //% block="A#2"
        As2 = 117,
        //% block="B2"
        B2 = 123,
        //% block="C3"
        C3 = 131,
        //% block="C#3"
        Cs3 = 139,
        //% block="D3"
        D3 = 147,
        //% block="D#3"
        Ds3 = 156,
        //% block="E3"
        E3 = 165,
        //% block="F3"
        F3 = 175,
        //% block="F#3"
        Fs3 = 185,
        //% block="G3"
        G3 = 196,
        //% block="G#3"
        Gs3 = 208,
        //% block="A3"
        A3 = 220,
        //% block="A#3"
        As3 = 233,
        //% block="B3"
        B3 = 247,
        //% block="C4"
        C4 = 262,
        //% block="C#4"
        Cs4 = 277,
        //% block="D4"
        D4 = 294,
        //% block="D#4"
        Ds4 = 311,
        //% block="E4"
        E4 = 330,
        //% block="F4"
        F4 = 349,
        //% block="F#4"
        Fs4 = 370,
        //% block="G4"
        G4 = 392,
        //% block="G#4"
        Gs4 = 415,
        //% block="A4"
        A4 = 440,
        //% block="A#4"
        As4 = 466,
        //% block="B4"
        B4 = 494,
        //% block="C5"
        C5 = 523,
        //% block="C#5"
        Cs5 = 554,
        //% block="D5"
        D5 = 587,
        //% block="D#5"
        Ds5 = 622,
        //% block="E5"
        E5 = 659,
        //% block="F5"
        F5 = 698,
        //% block="F#5"
        Fs5 = 740,
        //% block="G5"
        G5 = 784,
        //% block="G#5"
        Gs5 = 831,
        //% block="A5"
        A5 = 880,
        //% block="A#5"
        As5 = 932,
        //% block="B5"
        B5 = 988,
        //% block="C6"
        C6 = 1047,
        //% block="Rest"
        Rest = 0
    }
    
    export enum Duration {
        //% block="Whole"
        Whole = 4,
        //% block="Half"
        Half = 2,
        //% block="Quarter"
        Quarter = 1,
        //% block="Eighth"
        Eighth = 0.5,
        //% block="Sixteenth"
        Sixteenth = 0.25,
        //% block="Dotted Half"
        DottedHalf = 3,
        //% block="Dotted Quarter"
        DottedQuarter = 1.5,
        //% block="Dotted Eighth"
        DottedEighth = 0.75
    }
    
    export enum Dynamic {
        //% block="pp"
        PP = 30,
        //% block="p"
        P = 60,
        //% block="mp"
        MP = 90,
        //% block="mf"
        MF = 130,
        //% block="f"
        F = 180,
        //% block="ff"
        FF = 255
    }
    
    let currentTempo = 120;
    let currentDynamic = Dynamic.MF;
    let radioGroup = 1;
    let isPlayerMode = false;
    let conductorSignalReceived = false;
    
    //% block="set tempo to $bpm BPM"
    //% bpm.min=40 bpm.max=240 bpm.defl=120
    //% weight=100
    export function setTempo(bpm: number): void {
        currentTempo = bpm;
    }
    
    //% block="change tempo to $newBpm over $measures measures"
    //% newBpm.min=40 newBpm.max=240
    //% measures.min=1 measures.max=16
    //% weight=98
    export function changeTempo(newBpm: number, measures: number): void {
        let startBpm = currentTempo;
        let steps = measures * 4;
        let increment = (newBpm - startBpm) / steps;
        
        for (let i = 0; i < steps; i++) {
            currentTempo = startBpm + (increment * i);
            basic.pause(calculateDuration(Duration.Quarter));
        }
        currentTempo = newBpm;
    }
    
    //% block="set dynamic to $dynamic"
    //% weight=97
    export function setDynamic(dynamic: Dynamic): void {
        currentDynamic = dynamic;
    }
    
    function calculateDuration(duration: Duration): number {
        let quarterNoteDuration = 60000 / currentTempo;
        return quarterNoteDuration * duration;
    }
    
    //% block="play note $note || for $duration at $dynamic"
    //% duration.defl=Duration.Quarter
    //% expandableArgumentMode="toggle"
    //% weight=90
    export function playNote(note: Note, duration: Duration = Duration.Quarter, dynamic: Dynamic = null): void {
        if (dynamic === null) {
            dynamic = currentDynamic;
        }
        
        if (note === Note.Rest) {
            basic.pause(calculateDuration(duration));
        } else {
            music.setVolume(dynamic);
            music.playTone(note, calculateDuration(duration));
        }
    }
    
    //% block="rest for $duration"
    //% duration.defl=Duration.Quarter
    //% weight=89
    export function rest(duration: Duration): void {
        basic.pause(calculateDuration(duration));
    }
    
    //% block="stop all sounds"
    //% weight=80
    export function stopAll(): void {
        music.stopAllSounds();
    }
    
    let voices: Voice[] = [];
    let currentVoiceIndex = 0;
    
    class Voice {
        notes: Note[];
        durations: Duration[];
        dynamic: Dynamic;
        startDelay: number;
        
        constructor() {
            this.notes = [];
            this.durations = [];
            this.dynamic = Dynamic.MF;
            this.startDelay = 0;
        }
    }
    
    //% block="create voice $voiceNumber"
    //% voiceNumber.min=1 voiceNumber.max=4
    //% weight=75
    export function createVoice(voiceNumber: number): void {
        while (voices.length < voiceNumber) {
            voices.push(new Voice());
        }
        currentVoiceIndex = voiceNumber - 1;
    }
    
    //% block="add to voice: $note for $duration"
    //% duration.defl=Duration.Quarter
    //% weight=74
    export function addNoteToVoice(note: Note, duration: Duration): void {
        if (voices.length === 0) {
            createVoice(1);
        }
        voices[currentVoiceIndex].notes.push(note);
        voices[currentVoiceIndex].durations.push(duration);
    }
    
    //% block="set voice dynamic to $dynamic"
    //% weight=73
    export function setVoiceDynamic(dynamic: Dynamic): void {
        if (voices.length === 0) {
            createVoice(1);
        }
        voices[currentVoiceIndex].dynamic = dynamic;
    }
    
    //% block="set voice delay $measures measures"
    //% measures.min=0 measures.max=16
    //% weight=72
    export function setVoiceDelay(measures: number): void {
        if (voices.length === 0) {
            createVoice(1);
        }
        voices[currentVoiceIndex].startDelay = measures * 4 * (60000 / currentTempo);
    }
    
    //% block="play all voices"
    //% weight=71
    export function playAllVoices(): void {
        let maxLength = 0;
        for (let voice of voices) {
            if (voice.notes.length > maxLength) {
                maxLength = voice.notes.length;
            }
        }
        
        for (let i = 0; i < maxLength; i++) {
            for (let voice of voices) {
                if (i < voice.notes.length) {
                    if (i === 0 && voice.startDelay > 0) {
                        basic.pause(voice.startDelay);
                    }
                    let oldDynamic = currentDynamic;
                    currentDynamic = voice.dynamic;
                    playNote(voice.notes[i], voice.durations[i]);
                    currentDynamic = oldDynamic;
                }
            }
        }
    }
    
    //% block="clear all voices"
    //% weight=69
    export function clearAllVoices(): void {
        voices = [];
        currentVoiceIndex = 0;
    }
    
    //% block="setup as conductor on group $group"
    //% group.min=1 group.max=255 group.defl=1
    //% weight=65
    export function setupConductor(group: number): void {
        radioGroup = group;
        radio.setGroup(radioGroup);
        isPlayerMode = false;
        basic.showIcon(IconNames.Butterfly);
    }
    
    //% block="setup as player on group $group"
    //% group.min=1 group.max=255 group.defl=1
    //% weight=64
    export function setupPlayer(group: number): void {
        radioGroup = group;
        radio.setGroup(radioGroup);
        isPlayerMode = true;
        conductorSignalReceived = false;
        
        radio.onReceivedString(function (receivedString: string) {
            if (receivedString === "START") {
                conductorSignalReceived = true;
                basic.showIcon(IconNames.Yes);
                basic.pause(500);
                basic.clearScreen();
            } else if (receivedString === "STOP") {
                stopAll();
                basic.showIcon(IconNames.No);
            }
        })
        
        basic.showIcon(IconNames.SmallHeart);
    }
    
    //% block="conductor send START"
    //% weight=63
    export function conductorStart(): void {
        if (!isPlayerMode) {
            radio.sendString("START");
            basic.showIcon(IconNames.Yes);
            basic.pause(500);
            basic.clearScreen();
        }
    }
    
    //% block="conductor send STOP"
    //% weight=62
    export function conductorStop(): void {
        if (!isPlayerMode) {
            radio.sendString("STOP");
            stopAll();
        }
    }
    
    //% block="player wait for START"
    //% weight=61
    export function playerWaitForStart(): void {
        if (isPlayerMode) {
            basic.showIcon(IconNames.SmallHeart);
            while (!conductorSignalReceived) {
                basic.pause(100);
            }
            conductorSignalReceived = false;
        }
    }
    
    //% block="wait $measures measures"
    //% measures.min=1 measures.max=32
    //% weight=54
    export function waitMeasures(measures: number): void {
        let quarterNoteDuration = 60000 / currentTempo;
        basic.pause(measures * 4 * quarterNoteDuration);
    }
    
    //% block="metronome for $measures measures"
    //% measures.min=1 measures.max=32
    //% weight=53
    export function metronome(measures: number): void {
        let totalBeats = measures * 4;
        let beatDuration = 60000 / currentTempo;
        
        for (let i = 0; i < totalBeats; i++) {
            if (i % 4 === 0) {
                music.playTone(1000, 100);
            } else {
                music.playTone(800, 50);
            }
            basic.pause(beatDuration - 100);
        }
    }
}
