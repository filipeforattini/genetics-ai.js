# Snake Replay Overhaul Notes

## Background
The original replay HUD was still wired to the old sensor layout and printed static heatmaps that rarely explained why the genome stalled. While training moved to richer spatial and temporal sensors, the visualization kept showing “no sensor connections”, offering little insight into why the snakes stopped solving Level 2.

- **Sensor suite parity** – The replay runner now boots with the same 39-signal cache used in training (directional food offsets, corridor widths, danger proximity, exploration delta). That guarantees the HUD reflects the actual brain inputs frame by frame.
- **Neuron telemetry** – We added a lightweight NeuronBar: five columns of indexed bubbles that fade from `⚫` (inactive) through `⚪` and `🟢` to `🔴` when fully saturated. Because activations are read straight from the brain cache each tick, spikes and dead zones are immediately visible.
- **Action trace** – The UI keeps a rolling history of the last twenty chosen actions (⬆️, ⬅️, ➡️) so it is trivial to spot oscillations or stuck turn-loops without scrolling back through logs.
- **Cleaner panels** – Sensors print in three columns; neurons in five. Connected nodes render in yellow, and we stripped the old weight heatmaps and sensor→neuron summaries since they no longer matched the evolved topology.
- **Unified HUD** – The training script now reuses the exact replay HUD when you ask to “watch best”, so evolution and playback share the same visualization pipeline.
- **CLI overrides** – Pass `--max-generations=10000` (or `--generations 10000`) to let the trainer grind through a fixed count; omit it and the run continues until mastery or manual stop.

## Remaining Challenges
1. **Activation semantics** – We still rely on RELU outputs and cache values exposed by `brain.tick()`. Any programmable neuron that overrides `tick()` could behave differently between layers and HUD; so far none of the snake champions use the programmable base, but it’s worth monitoring.
2. **Scaling to larger nets** – For 50 hidden neurons the textual grid is fine. If we push the brain past ~128 neurons we will need pagination or a condensed sparkline view.
3. **Action attributions** – The replay shows what happened, not *why*. Future work could sample top inbound weights per active neuron and surface a mini causal chain for the chosen action.

## Latest Champion Snapshot
The latest champion (Gen 8, Fitness ≈ 3.67M) runs a 500-base genome across 50 neurons with a dense web of corridor and danger signals feeding into a handful of high-gain units. The replay shows:
- Most neurons stay near zero until the danger sensors fire, at which point a specific subset (≈ n14–n18) goes full `🔴` and drives `Left`.
- Food-forward offsets modulate mid-level neurons (n05–n12) with softer `🟢` activations that keep the snake aligned with the target when no danger is present.
- The action history oscillates between forward bursts and quick left taps whenever the exploration delta spikes, suggesting the genome learned to skim the boundary while banking hard to avoid self-collisions.

Reverse engineering the exact weight graph is still manual—the HUD exposes activations, but not per-edge contributions. If we need deeper forensic work, we can export the genome and run it through `diagnose-genome.js` or build a dedicated weight inspector. For first-pass debugging, though, the new neurons panel plus action timeline already highlight the critical “danger → hard left” reflex that was invisible in the old replay.***
