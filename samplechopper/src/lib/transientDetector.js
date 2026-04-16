/**
 * Detects transients (kicks/snares) and returns an array of chop timestamps.
 * @param {AudioBuffer} audioBuffer - The decoded audio from the user.
 * @param {number} threshold - Sensitivity (0.0 to 1.0). e.g., 0.85 for only the loudest hits.
 * @returns {Array<number>} Array of timestamps (in seconds) for the slices.
 */
export function getAutoChops(audioBuffer, threshold = 0.85) {
  const channelData = audioBuffer.getChannelData(0) // Analyze the left channel
  const sampleRate  = audioBuffer.sampleRate

  // 250ms minimum gap between slices to prevent microscopic chops
  const minChopLengthSeconds    = 0.25
  const minSamplesBetweenChops  = sampleRate * minChopLengthSeconds

  let chops             = [0] // Always start a chop at the very beginning
  let lastChopSampleIndex = 0

  // Find the absolute maximum volume in the track to set our baseline
  let maxAmplitude = 0
  for (let i = 0; i < channelData.length; i++) {
    if (Math.abs(channelData[i]) > maxAmplitude) maxAmplitude = Math.abs(channelData[i])
  }

  const triggerLevel = maxAmplitude * threshold

  // Scan the audio looking for spikes
  for (let i = 0; i < channelData.length; i++) {
    if (Math.abs(channelData[i]) >= triggerLevel) {
      // Is this hit far enough away from the last cut?
      if (i - lastChopSampleIndex >= minSamplesBetweenChops) {
        chops.push(i / sampleRate) // Convert sample index to seconds and save
        lastChopSampleIndex = i    // Reset the debounce timer
      }
    }
  }

  return chops // Hand this array to Wavesurfer to draw the regions!
}
