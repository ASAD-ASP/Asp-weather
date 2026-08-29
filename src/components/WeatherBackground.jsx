import { useEffect, useMemo } from "react";
import { useSettings } from "../context/SettingsContext";

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function createParticles(count, config = {}) {
  const {
    minSize = 8,
    maxSize = 16,
    minDuration = 2,
    maxDuration = 5,
    maxTop = 100,
  } = config;

  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: random(0, 100),
    top: random(0, maxTop),
    size: random(minSize, maxSize),
    duration: random(minDuration, maxDuration),
    delay: random(0, maxDuration),
  }));
}

function useMouseParallax(enabled) {
  useEffect(() => {
    const root = document.documentElement;

    if (!enabled) {
      root.style.setProperty("--mx", "0");
      root.style.setProperty("--my", "0");
      return undefined;
    }

    let ticking = false;
    let frameId = null;

    function handleMove(e) {
      if (ticking) return;

      ticking = true;

      frameId = requestAnimationFrame(() => {
        const x = (e.clientX / Math.max(window.innerWidth, 1) - 0.5) * 2;

        const y = (e.clientY / Math.max(window.innerHeight, 1) - 0.5) * 2;

        root.style.setProperty("--mx", x.toFixed(3));
        root.style.setProperty("--my", y.toFixed(3));

        ticking = false;
        frameId = null;
      });
    }

    window.addEventListener("mousemove", handleMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMove);

      if (frameId !== null) {
        cancelAnimationFrame(frameId);
      }

      root.style.setProperty("--mx", "0");
      root.style.setProperty("--my", "0");
    };
  }, [enabled]);
}

function WeatherBackground({ category = "sunny", isDay = true }) {
  const context = useSettings();

  const settings = context?.settings ?? {};
  const reduceMotion = Boolean(settings.reduceMotion);

  useMouseParallax(!reduceMotion);

  const mode = isDay ? "day" : "night";

  // Generate random values only once.
  const particles = useMemo(
    () => ({
      stars: createParticles(40, {
        minSize: 1,
        maxSize: 3,
        minDuration: 2,
        maxDuration: 5,
        maxTop: 55,
      }),

      dust: createParticles(18, {
        minSize: 1,
        maxSize: 3,
        minDuration: 6,
        maxDuration: 12,
        maxTop: 60,
      }),

      rainBack: createParticles(20, {
        minSize: 1,
        maxSize: 2,
        minDuration: 0.9,
        maxDuration: 1.3,
        maxTop: 0,
      }),

      rainMid: createParticles(25, {
        minSize: 1,
        maxSize: 2,
        minDuration: 0.6,
        maxDuration: 0.9,
        maxTop: 0,
      }),

      rainFront: createParticles(30, {
        minSize: 1,
        maxSize: 3,
        minDuration: 0.35,
        maxDuration: 0.6,
        maxTop: 0,
      }),

      splashes: createParticles(15, {
        minSize: 1,
        maxSize: 2,
        minDuration: 1,
        maxDuration: 3,
        maxTop: 0,
      }),

      stormMid: createParticles(25, {
        minSize: 1,
        maxSize: 2,
        minDuration: 0.35,
        maxDuration: 0.5,
        maxTop: 0,
      }),

      stormFront: createParticles(40, {
        minSize: 1,
        maxSize: 3,
        minDuration: 0.25,
        maxDuration: 0.4,
        maxTop: 0,
      }),

      snowFar: createParticles(18, {
        minSize: 8,
        maxSize: 13,
        minDuration: 9,
        maxDuration: 13,
        maxTop: 0,
      }),

      snowMid: createParticles(20, {
        minSize: 12,
        maxSize: 19,
        minDuration: 6,
        maxDuration: 9,
        maxTop: 0,
      }),

      snowNear: createParticles(15, {
        minSize: 16,
        maxSize: 26,
        minDuration: 4,
        maxDuration: 6.5,
        maxTop: 0,
      }),
    }),
    [],
  );

  return (
    <div className={`weather-bg ${category} ${mode}`}>
      <div className="scene-tint" />

      {/* Stars */}
      {!isDay && category !== "stormy" && (
        <div className="stars">
          {particles.stars.map((star) => (
            <div
              key={`star-${star.id}`}
              className="star"
              style={{
                left: `${star.left}%`,
                top: `${star.top}%`,
                animationDuration: `${star.duration}s`,
                animationDelay: `${star.delay}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Sunny */}
      {category === "sunny" && (
        <>
          {isDay ? (
            <>
              <div className="sun-glow" />

              <div className="sun">
                <div className="sun-rays" />
              </div>

              <div className="light-cloud light-cloud1" />
              <div className="light-cloud light-cloud2" />

              <div className="dust-layer">
                {particles.dust.map((dust) => (
                  <div
                    key={`dust-${dust.id}`}
                    className="dust"
                    style={{
                      left: `${dust.left}%`,
                      top: `${dust.top}%`,
                      animationDuration: `${dust.duration}s`,
                      animationDelay: `${dust.delay}s`,
                    }}
                  />
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="moon-glow" />

              <div className="moon">
                <div className="crater c-a" />
                <div className="crater c-b" />
                <div className="crater c-c" />
              </div>

              <div className="light-cloud light-cloud1 night-cloud" />
            </>
          )}
        </>
      )}

      {/* Cloudy */}
      {category === "cloudy" && (
        <>
          {isDay ? (
            <>
              <div className="diffused-sun" />
              <div className="god-rays" />
            </>
          ) : (
            <div className="moon-glow behind-clouds" />
          )}

          <div className="mist-layer" />

          <div className="cloud-layer far parallax depth-1">
            <div className="cloud cc1" />
            <div className="cloud cc2" />
          </div>

          <div className="cloud-layer mid parallax depth-2">
            <div className="cloud cc3" />
            <div className="cloud cc4" />
          </div>

          <div className="cloud-layer near parallax depth-3">
            <div className="cloud cc5" />
          </div>
        </>
      )}

      {/* Rainy */}
      {category === "rainy" && (
        <>
          <div className="cloud-layer far parallax depth-1">
            <div className="cloud c1" />
          </div>

          <div className="cloud-layer mid parallax depth-2">
            <div className="cloud c2" />
          </div>

          <div className="rain parallax depth-3">
            {particles.rainBack.map((drop) => (
              <div
                key={`rain-back-${drop.id}`}
                className="drop drop-back"
                style={{
                  left: `${drop.left}%`,
                  animationDuration: `${drop.duration}s`,
                  animationDelay: `${drop.delay}s`,
                }}
              />
            ))}

            {particles.rainMid.map((drop) => (
              <div
                key={`rain-mid-${drop.id}`}
                className="drop drop-mid"
                style={{
                  left: `${drop.left}%`,
                  animationDuration: `${drop.duration}s`,
                  animationDelay: `${drop.delay}s`,
                }}
              />
            ))}

            {particles.rainFront.map((drop) => (
              <div
                key={`rain-front-${drop.id}`}
                className="drop drop-front"
                style={{
                  left: `${drop.left}%`,
                  animationDuration: `${drop.duration}s`,
                  animationDelay: `${drop.delay}s`,
                }}
              />
            ))}
          </div>

          <div className="ground-splash">
            {particles.splashes.map((splash) => (
              <div
                key={`splash-${splash.id}`}
                className="splash"
                style={{
                  left: `${splash.left}%`,
                  animationDelay: `${splash.delay}s`,
                }}
              />
            ))}
          </div>

          <div className="wet-sheen" />
        </>
      )}

      {/* Stormy */}
      {category === "stormy" && (
        <>
          <div className="cloud-layer far parallax depth-1">
            <div className="cloud c1 dark" />
          </div>

          <div className="cloud-layer mid parallax depth-2">
            <div className="cloud c2 dark" />
          </div>

          <div className="rain parallax depth-3">
            {particles.stormMid.map((drop) => (
              <div
                key={`storm-mid-${drop.id}`}
                className="drop drop-mid"
                style={{
                  left: `${drop.left}%`,
                  animationDuration: `${drop.duration}s`,
                  animationDelay: `${drop.delay}s`,
                }}
              />
            ))}

            {particles.stormFront.map((drop) => (
              <div
                key={`storm-front-${drop.id}`}
                className="drop drop-storm"
                style={{
                  left: `${drop.left}%`,
                  animationDuration: `${drop.duration}s`,
                  animationDelay: `${drop.delay}s`,
                }}
              />
            ))}
          </div>

          <div className="lightning-flash" />
          <div className="lightning-bolt bolt1" />
          <div className="lightning-bolt bolt2" />
        </>
      )}

      {/* Snowy */}
      {category === "snowy" && (
        <>
          {!isDay && <div className="moon-glow" />}

          <div className="snow far parallax depth-1">
            {particles.snowFar.map((flake) => (
              <div
                key={`snow-far-${flake.id}`}
                className="flake"
                style={{
                  left: `${flake.left}%`,
                  fontSize: `${flake.size}px`,
                  animationDuration: `${flake.duration}s`,
                  animationDelay: `${flake.delay}s`,
                }}
              >
                ❄
              </div>
            ))}
          </div>

          <div className="snow mid parallax depth-2">
            {particles.snowMid.map((flake) => (
              <div
                key={`snow-mid-${flake.id}`}
                className="flake"
                style={{
                  left: `${flake.left}%`,
                  fontSize: `${flake.size}px`,
                  animationDuration: `${flake.duration}s`,
                  animationDelay: `${flake.delay}s`,
                }}
              >
                ❄
              </div>
            ))}
          </div>

          <div className="snow near parallax depth-3">
            {particles.snowNear.map((flake) => (
              <div
                key={`snow-near-${flake.id}`}
                className="flake"
                style={{
                  left: `${flake.left}%`,
                  fontSize: `${flake.size}px`,
                  animationDuration: `${flake.duration}s`,
                  animationDelay: `${flake.delay}s`,
                }}
              >
                ❄
              </div>
            ))}
          </div>
        </>
      )}

      <div className="vignette" />
    </div>
  );
}

export default WeatherBackground;
