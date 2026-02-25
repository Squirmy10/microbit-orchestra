# Orchestra Extension for micro:bit

Orchestral composition extension for MakeCode with full BPM control, dynamics, and radio synchronization.

## Features

- **Musical Notation:** Full control using whole, half, quarter, eighth, and sixteenth notes.
- **BPM Tempo Control:** Set precise speeds ranging from 40 to 240 BPM.
- **Dynamic Markings:** Control volume through standard notation (pp, p, mf, f, ff).
- **Key Signature Control:** Set a global key signature for the entire composition.
- **Note Ties:** Functionality to tie the duration of a previous note to the next.
- **Light Control:**
  - Progress Bar: Track song completion on the LED grid.
  - Dynamic Brightness: LEDs glow based on current orchestral volume.
  - Pitch Plotting: Real-time visual mapping of note pitches to LED coordinates.
- **Radio Synchronization:** Conductor mode to trigger synchronized starts for the whole orchestra.

## Block Samples

### Basic Composition
```blocks
Orchestra.setOrchestraTempo(120)
Orchestra.setDynamic(Dynamic.MF)
Orchestra.playNote(Note.C, NoteDuration.Quarter)
Orchestra.tieToNextNote()
Orchestra.playNote(Note.C, NoteDuration.Half)
```

### Visual Performance
```blocks
Orchestra.syncBrightness()
Orchestra.plotPitch(Note.G)
Orchestra.showProgress(1, 10)
```

## Use as Extension

This repository can be added as an extension in MakeCode.

1. Open https://makecode.microbit.org/
2. Click on **New Project**
3. Click on **Extensions** under the gearwheel menu
4. Search for `https://github.com/squirmy10/microbit-orchestra` and import

## Edit this Project

To edit this repository in MakeCode:

1. Open https://makecode.microbit.org/
2. Click on **Import** then click on **Import URL**
3. Paste `https://github.com/squirmy10/microbit-orchestra` and click import

## Supported Targets

- for PXT/microbit

---

**Metadata:** for PXT/microbit