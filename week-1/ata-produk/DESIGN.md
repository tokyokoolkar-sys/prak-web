---
name: Lotus Quant
description: A light analytical interface where cursor movement becomes an instrument for reading portfolio risk.
colors:
  paper: "#f7f5ef"
  paper-bright: "#fcfbf7"
  graphite: "#151718"
  graphite-soft: "#4e5552"
  graphite-muted: "#737a76"
  line: "rgba(21, 23, 24, 0.14)"
  line-strong: "rgba(21, 23, 24, 0.30)"
  cobalt: "#204fc7"
  cobalt-soft: "#6d8ee3"
  vermilion: "#d94525"
  evergreen: "#176f51"
typography:
  display:
    fontFamily: "Geist, Arial, sans-serif"
    fontSize: "clamp(52px, 6vw, 92px)"
    fontWeight: 540
    lineHeight: 0.96
    letterSpacing: "-0.06em"
  headline:
    fontFamily: "Geist, Arial, sans-serif"
    fontSize: "clamp(28px, 3vw, 48px)"
    fontWeight: 520
    lineHeight: 1
    letterSpacing: "-0.045em"
  body:
    fontFamily: "Geist, Arial, sans-serif"
    fontSize: "clamp(16px, 1.35vw, 20px)"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "Geist Mono, Consolas, monospace"
    fontSize: "8px"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.1em"
  process-copy:
    fontFamily: "Geist, Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 480
    lineHeight: 1.45
    letterSpacing: "normal"
  graph-label:
    fontFamily: "Geist Mono, Consolas, monospace"
    fontSize: "7px"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.05em"
rounded:
  none: "0px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "42px"
  xl: "72px"
components:
  button-primary:
    backgroundColor: "{colors.graphite}"
    textColor: "{colors.paper-bright}"
    rounded: "{rounded.none}"
    padding: "0 20px"
    height: "52px"
  button-primary-hover:
    backgroundColor: "{colors.cobalt}"
    textColor: "{colors.paper-bright}"
  button-ghost:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.graphite-soft}"
    rounded: "{rounded.none}"
    height: "auto"
---

# Design System: Lotus Quant

## Overview

**Creative North Star: "The Analytical Lens"**

Lotus Quant is a quiet professional interface built around one recurring act: placing attention onto a complicated portfolio signal. The optical risk field is not wallpaper. It visualizes exposure as a set of coherent channels and turns the pointer into a movable analytical lens, allowing the surface to show where attention is directed and what condition the model is in.

The visual system is light, minimal, and exact. Graphite type carries authority; cobalt marks analytical action; vermilion identifies correlated or liquidity risk. Surfaces stay flat and open. Hairline construction marks, restrained borders, tabular measurements, and generous whitespace establish precision without turning the page into a legacy trading terminal.

**Key Characteristics:**
- Pointer movement changes the model visualization directly.
- One optical field carries the product mechanism.
- Light paper surfaces and hairline construction keep the interface calm.
- Cobalt communicates analysis; vermilion is reserved for risk concentration.
- Synthetic or illustrative data is labeled wherever it could be mistaken for live output.

## Colors

The palette is a warm-white analytical ground with graphite structure and two analytical signal colors.

### Primary
- **Cobalt:** active navigation, selected states, primary signal channels, focus, and actions that ask the model to reason.
- **Graphite:** display type, the primary action at rest, primary signal ink, and all decisive interface text.

### Secondary
- **Vermilion:** correlated risk, liquidity stress, and the one state that needs immediate attention.
- **Evergreen:** reserved for healthy or contained risk states in future product surfaces.

### Neutral
- **Paper:** the application ground (`#f7f5ef`).
- **Paper Bright:** the optical field and floating readout surfaces (`#fcfbf7`).
- **Graphite Soft:** body and supporting copy.
- **Graphite Muted:** labels, measurements, and low-priority metadata.
- **Line / Line Strong:** construction marks, dividers, and boundaries.

**The Signal Restraint Rule.** Cobalt and vermilion describe model state, not decoration. They belong in the field, selected controls, focus states, and risk conclusions—not as ambient backgrounds.

## Typography

**Display Font:** Geist (Arial fallback)  
**Body Font:** Geist (Arial fallback)  
**Label/Mono Font:** Geist Mono (Consolas fallback)

**Character:** Geist carries a precise, contemporary product voice without the costumed futurism of a monospaced display face. Geist Mono is restricted to measurements, model states, and compact analytical metadata where tabular alignment matters.

### Hierarchy
- **Display** (540, `clamp(52px, 6vw, 92px)`, 0.96): the first-viewport product promise only.
- **Headline** (520, `clamp(28px, 3vw, 48px)`, 1): section-level reasoning and product conclusions.
- **Title** (520, `18–25px`, 1.15): compact action verdicts and meaningful interface states.
- **Body** (400, `16–20px`, 1.6): explanation, with a 43–48 character line measure.
- **Label** (500, `8–12px`, `0.1em`): measurements and model metadata; uppercase only when the content is navigational or machine-like.

**The Analysis Before Costume Rule.** Use monospace for data and measurements, never as the default display voice.

## Layout

The desktop hero uses a two-column analytical split: approximately 40% for the product promise and 60% for the optical risk field, with a subtle central construction line. The shader occupies the visual majority of the first viewport because the product mechanism is stronger than a supporting feature panel.

Below 1060px, the offer and field stack into a single column. Below 680px, the field becomes a fixed 500px analytical surface with controls anchored inside its lower and upper edges. Navigation reduces to brand and workspace action. The copilot reasoning moves from three columns to one continuous reading order.

Spacing follows an 8px base with larger intervals around decisions and headings. Tight groups belong to related controls; major sections receive at least 42–72px of separation. The desktop header is 72px; mobile is 64px.

## Elevation & Depth

The system is flat by default. It uses no ambient card shadows. Depth comes from optical overlap inside the WebGL field, tonal contrast between Paper and Paper Bright, 1px analytical boundaries, and state changes in color or position. Floating readouts use the same flat paper surface and a hairline border rather than glass or shadow.

**The Flat-By-Default Rule.** If depth is needed, add information or optical overlap—not a shadow.

## Shapes

Corners are square (0px). Geometry comes from ruled rectangles, field axes, signal ribbons, pointer rings, and measured intersections. The shader may use organic curvature mathematically, but interface containers never add rounded-card silhouettes or pill controls unless a future native control requires them.

**The Constructed Geometry Rule.** Curves live inside the analytical field; controls and reading surfaces stay sharply constructed.

## Components

### Buttons
- **Shape:** square, minimum height 52px.
- **Primary:** Graphite fill with Paper Bright text; 20px horizontal padding and a 17px arrow icon.
- **Hover / Focus:** cobalt at 200ms; hover rises 2px with a natural deceleration curve. Focus uses a 2px cobalt outline at 4px offset.
- **Secondary / Ghost:** borderless text with a single Graphite Strong underline; cobalt on hover.

### Controls / Chips
- **Style:** flat Paper Bright with 1px Line borders and square geometry.
- **State:** selected scenarios use Paper Bright and cobalt text; all others use Graphite Muted. Selected state is communicated by text color and surface, not an extra pill.

### Containers
- **Corner Style:** square.
- **Background:** Paper or Paper Bright.
- **Shadow Strategy:** none.
- **Border:** 1px Line for analytical boundaries.
- **Internal Padding:** 12–24px; no nested cards.

### Navigation
- **Style:** borderless 13px Geist links on a 72px desktop header. Center navigation collapses below 1060px. Brand remains left; the workspace action remains right.

### Optical Risk Field
- **Signature behavior:** a low-power WebGL fragment shader draws five coherent signal ribbons over a warm-white field. Pointer position acts as a local lens; pointer velocity changes signal brightness and a restrained vermilion lens tint. Risk scenarios morph the topology rather than swapping the canvas.
- **Bounds:** render at a maximum device-pixel ratio of 1.5 and approximately 30fps. Pause when hidden or outside the viewport. Preserve a static layered fallback when WebGL is unavailable.
- **Accessibility:** the canvas is decorative. The region has a semantic label; scenario buttons and left/right arrow keys provide equivalent state control. Reduced motion freezes time and removes pointer easing while preserving state transitions.

### Copilot Reasoning
- **Structure:** three unboxed columns: observation, live reasoning process, and next move. The recommendation remains pending while the process runs; it is never shown early.
- **Sequence:** `scanning` (0–760ms) reads portfolio context; `correlating` (760–1540ms) maps shared risk factors; `evaluating` (1540–2380ms) compares possible responses; `ready` reveals the output.
- **Motion:** a 1.45s optical scan beam moves across the reasoning graph. Each thought stage draws one analytical path over 760ms and activates its corresponding node. The completed output resolves with one 520ms left-to-right reveal; no bounce or repeated fade-up sequence.
- **Control:** changing a portfolio scenario interrupts and restarts the sequence. A visible `Reason again` control replays it on demand.
- **Accessibility:** the section uses `aria-busy` while processing and an `aria-live` status region for each thought stage. Reduced-motion mode skips directly to `ready` while preserving all semantic content.

## Do's and Don'ts

### Do:
- **Do** let pointer movement alter the analytical field within a bounded, useful region.
- **Do** reserve cobalt for analysis and vermilion for concentrated risk.
- **Do** keep synthetic data explicitly labeled.
- **Do** use square controls, tabular measurements, and visible focus states.
- **Do** pause shader work offscreen and preserve keyboard scenario control.

### Don't:
- **Don't** add neon glow, dark terminal panels, glass cards, or dashboard-card grids.
- **Don't** use the shader as ambient decoration unrelated to portfolio state.
- **Don't** use monospace as the display face.
- **Don't** hide decorative canvas content without semantic text and keyboard-equivalent controls.
- **Don't** use rounded pill containers or icons as substitutes for clear labels.
