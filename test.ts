// Sets the tempo to 140 BPM
Orchestra.setOrchestraTempo(140)

// Wait for the conductor signal '1' to start playing
Orchestra.onSignalReceived(1, function () {
    Orchestra.playOrchestraNote(Note.C, NoteDuration.Quarter, Dynamic.MF)
    Orchestra.playOrchestraNote(Note.E, NoteDuration.Quarter, Dynamic.F)
    Orchestra.playOrchestraNote(Note.G, NoteDuration.Half, Dynamic.FF)
})
