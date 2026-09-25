"use client";

import { useEffect, useRef, useState } from "react";

type ScenarioId = "steady" | "cluster" | "liquidity";

type Scenario = {
  label: string;
  risk: string;
  delta: string;
  summary: string;
  reason: string;
  action: string;
  exposure: number;
};

const scenarios: Record<ScenarioId, Scenario> = {
  steady: {
    label: "Balanced",
    risk: "31.8",
    delta: "+0.6%",
    summary: "Exposure remains inside the illustrative portfolio envelope.",
    reason:
      "Position-level volatility is moving independently. The current allocation preserves diversified drawdown behavior.",
    action: "Keep the portfolio in observation mode",
    exposure: 42,
  },
  cluster: {
    label: "Correlated",
    risk: "64.2",
    delta: "+18.4%",
    summary: "Four simulated positions are converging on one factor cluster.",
    reason:
      "The copilot is weighting factor overlap—not position size alone—to explain why the portfolio risk is accelerating.",
    action: "Test a partial hedge against the shared factor",
    exposure: 78,
  },
  liquidity: {
    label: "Liquidity",
    risk: "52.6",
    delta: "+9.7%",
    summary: "Spread assumptions widen as correlated exits lose independence.",
    reason:
      "The modeled exit window is compressing. Two simulated positions concentrate the portfolio into the same liquidity window.",
    action: "Review concentration and exit-time bands",
    exposure: 61,
  },
};

const scenarioOrder: ScenarioId[] = ["steady", "cluster", "liquidity"];

const vertexShaderSource = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const fragmentShaderSource = `
  precision highp float;

  uniform vec2 u_resolution;
  uniform vec2 u_pointer;
  uniform vec2 u_velocity;
  uniform float u_time;
  uniform float u_scenario;

  float softLine(float value, float width) {
    return 1.0 - smoothstep(width, width * 3.2, abs(value));
  }

  float ribbon(float value, float width, float alpha) {
    float core = softLine(value, width);
    float halo = 1.0 - smoothstep(width * 2.0, width * 18.0, abs(value));
    return core + halo * 0.16 * alpha;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec2 p = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    vec2 pointer = (u_pointer * u_resolution.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    vec2 toPointer = p - pointer;
    float pointerDistance = length(toPointer);
    float lens = exp(-pointerDistance * 3.2);
    float speed = clamp(length(u_velocity) * 7.0, 0.0, 1.0);
    float t = u_time;

    float stress = u_scenario;
    float center = mix(-0.1, 0.34, stress);
    float bend = toPointer.y * lens * (0.34 + speed * 0.42);
    float globalDrift = sin(p.x * 1.35 + t * 0.23) * (0.04 + stress * 0.04);
    float correlationPull = exp(-pow((p.x - center) * 2.15, 2.0)) * stress * 0.24;

    float channelA = p.y + 0.26 + sin(p.x * 2.1 + t * 0.18) * 0.11 + globalDrift + bend;
    float channelB = p.y + 0.07 + sin(p.x * 3.25 - t * 0.15 + 1.4) * 0.08 + globalDrift * 0.7 + bend * 0.74;
    float channelC = p.y - 0.12 + sin(p.x * 4.5 + t * 0.11 + 2.1) * 0.065 - globalDrift * 0.5 + bend * 0.48;
    float channelD = p.y - 0.31 + sin(p.x * 1.75 - t * 0.14 + 0.4) * 0.09 - globalDrift * 0.8 + bend * 0.32;
    float channelE = p.y + 0.42 + sin(p.x * 2.85 + t * 0.12 + 3.0) * 0.075 + globalDrift * 0.4 + bend * 0.2;

    channelB += correlationPull * (0.5 + 0.5 * sin(p.x * 7.0));
    channelC += correlationPull * 0.72;
    channelA -= correlationPull * 0.24;

    float directionFade = smoothstep(-1.35, -0.35, p.x) * (1.0 - smoothstep(0.55, 1.35, p.x));
    float finePulse = 0.74 + sin(p.x * 48.0 - t * 0.8) * 0.08 + speed * 0.18;
    float alpha = 0.55 + lens * 0.35 + speed * 0.12;

    vec3 paper = vec3(0.976, 0.973, 0.955);
    vec3 graphite = vec3(0.10, 0.105, 0.11);
    vec3 cobalt = vec3(0.10, 0.28, 0.78);
    vec3 vermilion = vec3(0.86, 0.24, 0.12);
    vec3 softBlue = vec3(0.40, 0.57, 0.90);
    vec3 color = paper;

    float gridX = 1.0 - smoothstep(0.0, 0.016, abs(fract((uv.x * 14.0) + 0.5) - 0.5));
    float gridY = 1.0 - smoothstep(0.0, 0.016, abs(fract((uv.y * 10.0) + 0.5) - 0.5));
    float construction = max(gridX, gridY) * 0.026;
    color = mix(color, graphite, construction);

    color = mix(color, cobalt, ribbon(channelA, 0.007, alpha) * directionFade * finePulse);
    color = mix(color, cobalt, ribbon(channelB, 0.0045, alpha) * directionFade * finePulse);
    color = mix(color, vermilion, ribbon(channelC, 0.006, alpha) * directionFade * (0.7 + stress * 0.3));
    color = mix(color, softBlue, ribbon(channelD, 0.0035, alpha) * directionFade * 0.82);
    color = mix(color, graphite, ribbon(channelE, 0.0025, alpha) * directionFade * 0.22);

    float connector = exp(-abs(p.y - channelC) * 13.0) * exp(-abs(p.x - center) * 4.0);
    color = mix(color, vermilion, connector * stress * 0.16);

    float ring = abs(pointerDistance - 0.17 - speed * 0.02);
    float ringInk = 1.0 - smoothstep(0.0, 0.008, ring);
    float ringFade = smoothstep(1.0, 0.18, pointerDistance);
    color = mix(color, graphite, ringInk * ringFade * 0.26);

    float crossX = 1.0 - smoothstep(0.0, 0.0025, abs(toPointer.x));
    float crossY = 1.0 - smoothstep(0.0, 0.0025, abs(toPointer.y));
    float crossFade = smoothstep(0.24, 0.0, pointerDistance);
    color = mix(color, cobalt, max(crossX, crossY) * crossFade * 0.24);

    float warmLens = exp(-pointerDistance * 5.4) * speed * 0.075;
    color = mix(color, vermilion, warmLens);

    float paperNoise = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
    color += (paperNoise - 0.5) * 0.008;

    gl_FragColor = vec4(color, 1.0);
  }
`;

function createShader(
  context: WebGLRenderingContext,
  type: number,
  source: string,
) {
  const shader = context.createShader(type);
  if (!shader) return null;
  context.shaderSource(shader, source);
  context.compileShader(shader);
  if (!context.getShaderParameter(shader, context.COMPILE_STATUS)) {
    context.deleteShader(shader);
    return null;
  }
  return shader;
}

function RiskField({ scenario }: { scenario: ScenarioId }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fieldRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef({ x: 0.5, y: 0.5, previousX: 0.5, previousY: 0.5 });
  const scenarioRef = useRef(scenario);
  const [webglAvailable, setWebglAvailable] = useState(true);

  useEffect(() => {
    scenarioRef.current = scenario;
  }, [scenario]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const field = fieldRef.current;
    if (!canvas || !field) return;

    const context = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      powerPreference: "low-power",
    });

    if (!context) {
      setWebglAvailable(false);
      return;
    }

    const vertexShader = createShader(
      context,
      context.VERTEX_SHADER,
      vertexShaderSource,
    );
    const fragmentShader = createShader(
      context,
      context.FRAGMENT_SHADER,
      fragmentShaderSource,
    );
    const program = context.createProgram();
    if (!vertexShader || !fragmentShader || !program) {
      setWebglAvailable(false);
      return;
    }

    context.attachShader(program, vertexShader);
    context.attachShader(program, fragmentShader);
    context.linkProgram(program);
    if (!context.getProgramParameter(program, context.LINK_STATUS)) {
      setWebglAvailable(false);
      return;
    }

    const positionBuffer = context.createBuffer();
    context.bindBuffer(context.ARRAY_BUFFER, positionBuffer);
    context.bufferData(
      context.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      context.STATIC_DRAW,
    );

    const positionLocation = context.getAttribLocation(program, "a_position");
    const resolutionLocation = context.getUniformLocation(program, "u_resolution");
    const pointerLocation = context.getUniformLocation(program, "u_pointer");
    const velocityLocation = context.getUniformLocation(program, "u_velocity");
    const timeLocation = context.getUniformLocation(program, "u_time");
    const scenarioLocation = context.getUniformLocation(program, "u_scenario");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let isVisible = true;
    let animationFrame = 0;
    let lastFrame = 0;
    const startTime = performance.now();
    const pointer = pointerRef.current;
    const smoothedPointer = { x: 0.5, y: 0.5 };
    let smoothedScenario = scenarioOrder.indexOf(scenarioRef.current);

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = Math.max(1, Math.floor(field.clientWidth * ratio));
      const height = Math.max(1, Math.floor(field.clientHeight * ratio));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        context.viewport(0, 0, width, height);
      }
    };

    const render = (timestamp: number) => {
      if (timestamp - lastFrame < 32) {
        animationFrame = window.requestAnimationFrame(render);
        return;
      }
      lastFrame = timestamp;

      const elapsed = reducedMotion.matches ? 0 : (timestamp - startTime) / 1000;
      const targetScenario = scenarioOrder.indexOf(scenarioRef.current);
      const smoothing = reducedMotion.matches ? 1 : 0.075;
      const velocityX = pointer.x - pointer.previousX;
      const velocityY = pointer.y - pointer.previousY;
      pointer.previousX = pointer.x;
      pointer.previousY = pointer.y;
      smoothedPointer.x += (pointer.x - smoothedPointer.x) * smoothing;
      smoothedPointer.y += (pointer.y - smoothedPointer.y) * smoothing;
      smoothedScenario += (targetScenario - smoothedScenario) * (reducedMotion.matches ? 1 : 0.06);

      resize();
      context.useProgram(program);
      context.bindBuffer(context.ARRAY_BUFFER, positionBuffer);
      context.enableVertexAttribArray(positionLocation);
      context.vertexAttribPointer(positionLocation, 2, context.FLOAT, false, 0, 0);
      context.uniform2f(resolutionLocation, canvas.width, canvas.height);
      context.uniform2f(pointerLocation, smoothedPointer.x, 1 - smoothedPointer.y);
      context.uniform2f(velocityLocation, velocityX, -velocityY);
      context.uniform1f(timeLocation, elapsed);
      context.uniform1f(scenarioLocation, smoothedScenario / 2);
      context.drawArrays(context.TRIANGLES, 0, 6);

      if (isVisible) animationFrame = window.requestAnimationFrame(render);
    };

    const start = () => {
      if (!animationFrame) animationFrame = window.requestAnimationFrame(render);
    };
    const stop = () => {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = 0;
    };
    const handleVisibility = () => {
      isVisible = document.visibilityState === "visible";
      if (isVisible) start();
      else stop();
    };
    const resizeObserver = new ResizeObserver(resize);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting && document.visibilityState === "visible";
      if (isVisible) start();
      else stop();
    });

    resizeObserver.observe(field);
    intersectionObserver.observe(field);
    document.addEventListener("visibilitychange", handleVisibility);
    start();

    return () => {
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
      context.deleteBuffer(positionBuffer);
      context.deleteProgram(program);
      context.deleteShader(vertexShader);
      context.deleteShader(fragmentShader);
    };
  }, []);

  const updatePointer = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const bounds = canvas.getBoundingClientRect();
    pointerRef.current.x = (clientX - bounds.left) / bounds.width;
    pointerRef.current.y = (clientY - bounds.top) / bounds.height;
  };

  return (
    <div
      className="shader-field"
      ref={fieldRef}
      onPointerMove={(event) => updatePointer(event.clientX, event.clientY)}
      onPointerDown={(event) => updatePointer(event.clientX, event.clientY)}
      aria-label={`Interactive illustrative ${scenarios[scenario].label.toLowerCase()} portfolio-risk field. Move the pointer to bend the modeled risk channels.`}
    >
      <canvas ref={canvasRef} aria-hidden="true" />
      {!webglAvailable && <div className="shader-fallback" aria-hidden="true" />}
      <div className="field-axis field-axis-top" aria-hidden="true">
        <span>PORTFOLIO FIELD</span>
        <span>ILLUSTRATIVE / {scenarios[scenario].label.toUpperCase()}</span>
      </div>
      <div className="field-crosshair" aria-hidden="true">
        <span />
        <span />
      </div>
    </div>
  );
}

function LotusMark() {
  return (
    <svg viewBox="0 0 36 36" aria-hidden="true">
      <path d="M18 4c4.2 5.1 5.7 10.2 4.5 15.2" />
      <path d="M18 4c-4.2 5.1-5.7 10.2-4.5 15.2" />
      <path d="M13.5 19.2C8 18.5 4.2 16 2.5 11.8c5.6-.5 9.6 1.8 11 7.4Z" />
      <path d="M22.5 19.2c5.5-.7 9.3-3.2 11-7.4-5.6-.5-9.6 1.8-11 7.4Z" />
      <path d="M5.2 25.1c4.3 1 8.1-.4 11.3-4.2" />
      <path d="M30.8 25.1c-4.3 1-8.1-.4-11.3-4.2" />
      <path d="M8.3 29.2h19.4" />
    </svg>
  );
}

type CopilotPhase = "idle" | "scanning" | "correlating" | "evaluating" | "ready";

const copilotSteps: Array<{
  phase: CopilotPhase;
  label: string;
  heading: string;
  processing: string;
}> = [
  {
    phase: "scanning",
    label: "Reading context",
    heading: "Reading portfolio context",
    processing: "Scanning position weights, factor exposure, and current risk channels…",
  },
  {
    phase: "correlating",
    label: "Connecting factors",
    heading: "Connecting risk factors",
    processing: "Mapping overlapping drivers and their contribution to portfolio variance…",
  },
  {
    phase: "evaluating",
    label: "Testing responses",
    heading: "Testing possible responses",
    processing: "Comparing concentration, liquidity, and hedge scenarios without executing a trade…",
  },
];

function ArrowIcon() {
  return (
    <svg viewBox="0 0 18 18" aria-hidden="true">
      <path d="M3 9h11M10 5l4 4-4 4" />
    </svg>
  );
}

function ReplayIcon() {
  return (
    <svg viewBox="0 0 18 18" aria-hidden="true">
      <path d="M14.5 6.5A6 6 0 1 0 15 10" />
      <path d="M14.5 2.8v3.7h-3.7" />
    </svg>
  );
}

export default function Home() {
  const [activeScenario, setActiveScenario] =
    useState<ScenarioId>("cluster");
  const [copilotPhase, setCopilotPhase] =
    useState<CopilotPhase>("idle");
  const [replayKey, setReplayKey] = useState(0);
  const copilotRef = useRef<HTMLElement>(null);
  const scenario = scenarios[activeScenario];
  const activeStepIndex = copilotSteps.findIndex(
    (step) => step.phase === copilotPhase,
  );
  const activeStep = copilotSteps[activeStepIndex] ?? copilotSteps[0];
  const isCopilotReady = copilotPhase === "ready";
  const isCopilotThinking = copilotPhase !== "ready" && copilotPhase !== "idle";

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const readyTimer = window.setTimeout(
        () => setCopilotPhase("ready"),
        0,
      );
      return () => window.clearTimeout(readyTimer);
    }

    let hasPlayed = false;
    const playSequence = () => {
      setCopilotPhase("scanning");
      const correlatingTimer = window.setTimeout(
        () => setCopilotPhase("correlating"),
        760,
      );
      const evaluatingTimer = window.setTimeout(
        () => setCopilotPhase("evaluating"),
        1540,
      );
      const readyTimer = window.setTimeout(
        () => setCopilotPhase("ready"),
        2380,
      );

      return () => {
        window.clearTimeout(correlatingTimer);
        window.clearTimeout(evaluatingTimer);
        window.clearTimeout(readyTimer);
      };
    };

    const section = copilotRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasPlayed) {
          hasPlayed = true;
          cleanupTimers = playSequence();
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );

    let cleanupTimers: (() => void) | undefined;
    observer.observe(section);

    return () => {
      observer.disconnect();
      cleanupTimers?.();
    };
  }, [activeScenario, replayKey]);

  const selectScenario = (id: ScenarioId) => {
    setActiveScenario(id);
    setReplayKey((key) => key + 1);
  };

  const replayCopilot = () => {
    setReplayKey((key) => key + 1);
  };

  const moveScenario = (direction: number) => {
    const currentIndex = scenarioOrder.indexOf(activeScenario);
    const nextIndex =
      (currentIndex + direction + scenarioOrder.length) % scenarioOrder.length;
    setActiveScenario(scenarioOrder[nextIndex]);
    setReplayKey((key) => key + 1);
  };

  return (
    <div className="lotus-page">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Lotus Quant home">
          <span className="brand-mark"><LotusMark /></span>
          <span>LOTUS QUANT</span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#risk-field">Risk model</a>
          <a href="#copilot">Copilot</a>
          <a href="#principles">Principles</a>
        </nav>
        <a className="header-action" href="#risk-field">
          Open workspace <ArrowIcon />
        </a>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <h1 id="hero-title">Reason with every risk.</h1>
            <p>
              An AI copilot that reads your portfolio context, challenges
              hidden exposure, and keeps your judgment in control.
            </p>
            <div className="hero-actions">
              <a className="primary-action" href="#risk-field">
                Explore the workspace <ArrowIcon />
              </a>
              <a className="text-action" href="#copilot">
                See how the copilot reasons
              </a>
            </div>
          </div>

          <div
            className="risk-workspace"
            id="risk-field"
            role="region"
            aria-label="Portfolio risk workspace"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === "ArrowLeft") {
                event.preventDefault();
                moveScenario(-1);
              }
              if (event.key === "ArrowRight") {
                event.preventDefault();
                moveScenario(1);
              }
            }}
          >
            <RiskField scenario={activeScenario} />

            <div className="workspace-controls" aria-label="Portfolio scenarios">
              {scenarioOrder.map((id) => (
                <button
                  key={id}
                  type="button"
                  className={activeScenario === id ? "active" : ""}
                  onClick={() => selectScenario(id)}
                  aria-pressed={activeScenario === id}
                >
                  <span>{scenarios[id].label}</span>
                  <small>{scenarios[id].risk}</small>
                </button>
              ))}
            </div>

            <div className="workspace-readout">
              <span>MODELED RISK</span>
              <strong>{scenario.risk}</strong>
              <small>{scenario.delta} FROM BASELINE</small>
            </div>
          </div>
        </section>

        <section
          className={`copilot-section phase-${copilotPhase}`}
          id="copilot"
          ref={copilotRef}
          aria-labelledby="copilot-title"
          aria-busy={isCopilotThinking}
        >
          <div className="copilot-heading">
            <span className="ai-symbol" aria-hidden="true">L</span>
            <div>
              <h2 id="copilot-title">What Lotus sees</h2>
              <p>
                {isCopilotReady
                  ? scenario.summary
                  : activeStep.processing}
              </p>
            </div>
            <button
              className="replay-reasoning"
              type="button"
              onClick={replayCopilot}
              aria-label="Replay the copilot reasoning sequence"
            >
              <ReplayIcon />
              {isCopilotThinking ? "Thinking" : "Reason again"}
            </button>
          </div>

          <div className="reasoning-process" aria-live="polite" aria-atomic="true">
            <div className="reasoning-process-header">
              <span>{isCopilotReady ? "REASONING COMPLETE" : "REASONING"}</span>
              <span>{isCopilotReady ? "OUTPUT READY" : activeStep.label}</span>
            </div>

            <div className="reasoning-graph" aria-hidden="true">
              <div className="reasoning-scan" />
              <svg viewBox="0 0 420 116" preserveAspectRatio="none">
                <path className="reason-path path-one" d="M34 58H150C178 58 188 22 216 22S256 82 286 82s38-24 100-24" />
                <path className="reason-path path-two" d="M34 58H138c28 0 36 38 68 38s42-52 74-52 38 38 106 38" />
                <path className="reason-path path-three" d="M34 58h84c24 0 34 26 58 26h244" />
              </svg>
              {copilotSteps.map((step, index) => {
                const isActive = step.phase === copilotPhase;
                const isComplete =
                  isCopilotReady ||
                  (activeStepIndex >= 0 && index < activeStepIndex);
                return (
                  <div
                    className={`reason-node node-${index + 1}${isActive ? " active" : ""}${isComplete ? " complete" : ""}`}
                    key={step.phase}
                  >
                    <i />
                    <span>{step.label}</span>
                  </div>
                );
              })}
            </div>

            <div className={`process-message ${isCopilotReady ? "ready" : ""}`}>
              <span>{isCopilotReady ? "OUTPUT" : `STEP ${Math.max(activeStepIndex + 1, 1)} / 3`}</span>
              <strong>
                {isCopilotReady ? scenario.reason : activeStep.heading}
              </strong>
            </div>
          </div>

          <div className={`copilot-action ${isCopilotReady ? "ready" : "pending"}`}>
            <span>NEXT MOVE</span>
            <strong aria-live="polite">
              {isCopilotReady ? scenario.action : "Forming a recommendation…"}
            </strong>
            <small>
              {isCopilotReady
                ? `${scenario.exposure}% MODELED EXPOSURE`
                : "NO TRADE EXECUTED"}
            </small>
          </div>
        </section>

        <section className="principles" id="principles" aria-label="Lotus Quant principles">
          <div><span>01</span><strong>Context before conclusions</strong></div>
          <div><span>02</span><strong>Reasoning you can inspect</strong></div>
          <div><span>03</span><strong>Human decisions stay human</strong></div>
        </section>
      </main>

      <footer>
        <span>© 2026 LOTUS QUANT</span>
        <span>AI RISK COPILOT / CONCEPT INTERFACE</span>
        <a href="#top">Back to top <ArrowIcon /></a>
      </footer>
    </div>
  );
}
