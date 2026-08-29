import { useEffect, useRef } from "react";

export function useAmbientSound(category, enabled) {
  const ctxRef = useRef(null);
  const nodesRef = useRef({});

  useEffect(() => {
    if (!enabled) {
      cleanup();
      return;
    }
    start(category);
    return cleanup;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, category]);

  useEffect(() => cleanup, []);

  function cleanup() {
    if (nodesRef.current.thunderTimeout) {
      clearTimeout(nodesRef.current.thunderTimeout);
    }
    const ctx = ctxRef.current;
    if (ctx) {
      try {
        ctx.close();
      } catch {
        /* ignore */
      }
    }
    ctxRef.current = null;
    nodesRef.current = {};
  }

  function makeNoiseBuffer(ctx) {
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  function start(cat) {
    cleanup();
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    ctxRef.current = ctx;

    const noise = ctx.createBufferSource();
    noise.buffer = makeNoiseBuffer(ctx);
    noise.loop = true;

    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    if (cat === "rainy" || cat === "stormy") {
      filter.type = "highpass";
      filter.frequency.value = 900;
      gain.gain.value = 0.05;
    } else if (cat === "snowy") {
      filter.type = "lowpass";
      filter.frequency.value = 500;
      gain.gain.value = 0.02;
    } else {
      filter.type = "lowpass";
      filter.frequency.value = 700;
      gain.gain.value = 0.018;
    }

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start();

    // نوسان آروم صدا شبیه وزش باد
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.15;
    lfoGain.gain.value = gain.gain.value * 0.5;
    lfo.connect(lfoGain);
    lfoGain.connect(gain.gain);
    lfo.start();

    nodesRef.current = { noise, filter, gain, lfo, lfoGain };

    if (cat === "stormy") {
      scheduleThunder(ctx);
    }
  }

  function scheduleThunder(ctx) {
    function boom() {
      if (!ctxRef.current) return;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = 60 + Math.random() * 30;
      g.gain.value = 0;
      osc.connect(g);
      g.connect(ctx.destination);
      const now = ctx.currentTime;
      g.gain.linearRampToValueAtTime(0.25, now + 0.05);
      g.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
      osc.start(now);
      osc.stop(now + 1.3);
      const nextIn = 6000 + Math.random() * 9000;
      nodesRef.current.thunderTimeout = setTimeout(boom, nextIn);
    }
    nodesRef.current.thunderTimeout = setTimeout(
      boom,
      2000 + Math.random() * 4000,
    );
  }
}
