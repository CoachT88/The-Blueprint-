import { useState, useEffect, useRef, useCallback, useMemo } from "react";

/* ═══════════════════════════════════════════════════════════════
HARMONYMAP v4 — "Find Yourself in Sound"
Complete emotion-driven music theory app for beginners
═══════════════════════════════════════════════════════════════ */

// ─── AUDIO ENGINE ───────────────────────────────────────────
class AudioEngine {
constructor() { this.ctx=null; this.mg=null; this.rv=null; this.isPlaying=false; this.tids=[]; }
init() {
if(this.ctx) return;
this.ctx=new(window.AudioContext||window.webkitAudioContext)();
this.mg=this.ctx.createGain(); this.mg.gain.value=0.32;
const d=this.ctx.createDelay(); d.delayTime.value=0.07;
const f=this.ctx.createGain(); f.gain.value=0.18;
d.connect(f); f.connect(d); d.connect(this.mg); f.connect(this.mg);
this.rv=d; this.mg.connect(this.ctx.destination);
}
noteToFreq(n) {
const M={C:0,'C#':1,Db:1,D:2,'D#':3,Eb:3,E:4,F:5,'F#':6,Gb:6,G:7,'G#':8,Ab:8,A:9,'A#':10,Bb:10,B:11};
const m=n.match(/^([A-G][#b]?)(\d)$/); if(!m) return 440;
return 440*Math.pow(2,(M[m[1]]-9+(parseInt(m[2])-4)*12)/12);
}
stop() { this.isPlaying=false; this.tids.forEach(t=>clearTimeout(t)); this.tids=[]; }
}
const audio=new AudioEngine();

export default function HarmonyMap(){
  return <div>HarmonyMap Loading...</div>;
}
