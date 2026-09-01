# EntropyHub

A chaotic pseudo-random generator built on an RK4-integrated Rössler system,
seeded from OS entropy, that can prove its own chaos at runtime instead of
just asserting it.

```python
from entropyhub import EntropyHub

hub = EntropyHub()
print(hub.verify_chaos())      # ~0.071 (literature value: ~0.0714)
print(hub.random_bytes(16))
print(hub.random_int(1, 6))
```

## What this is, and what it is not

This is a **deterministic PRNG**. Given the same internal state, it always
produces the same output. Its unpredictability rests entirely on the seed
staying secret — by default drawn once from OS entropy — not on any inherent
"true" randomness in the chaotic dynamics themselves.

It has **not** been independently cryptanalyzed. Do not use it as a drop-in
replacement for a vetted CSPRNG (e.g. `ChaCha20Rng`, `os.urandom`, `secrets`)
in a security-critical context. It's a legitimate, verifiably-chaotic PRNG
core suitable for simulation, Monte Carlo methods, procedural generation, and
studying/demonstrating chaos-based number generation — not a claim of
cryptographic security.

## Why "verifiable" chaos matters here

An earlier version of this project integrated the Rössler equations with
explicit Euler at `dt=0.01`. That version used the textbook "chaotic"
parameters (a=0.2, b=0.2, c=5.7) but, measured with Benettin's method over
multi-million-step horizons, had a largest Lyapunov exponent of **~0.00000** —
not measurably chaotic. Two initial states 1e-9 apart never diverged beyond
1e-8 even after 5000 time units. The parameters were right; the integrator was
silently killing the chaos.

Switching to 4th-order Runge-Kutta fixed it:

| Integrator | Chaotic params (c=5.7) | Periodic params (c=2.5) |
|---|---|---|
| Euler, dt=0.01 | λ ≈ 0.000006 | λ ≈ 0.000008 |
| RK4, dt=0.01 | **λ ≈ 0.071** (lit.: ~0.0714) | λ ≈ 0.000021 |

Rather than trust that a fixed parameter set stays chaotic forever, this
crate exposes [`estimate_lyapunov`](crates/entropyhub-core/src/lib.rs) /
`verify_chaos()` so any consumer can measure it directly, and
[`tests/chaos_verification.rs`](crates/entropyhub-core/tests/chaos_verification.rs)
runs that measurement on every `cargo test` — if a future change
(integrator, step size, parameters) ever kills the chaos again, the test
suite catches it instead of shipping a PRNG that only looks chaotic on paper.

## Project layout

This is a Cargo workspace with two crates plus a Python package:

```
crates/
  entropyhub-core/     pure Rust: RK4 Rössler system, OS seeding, SHA-256
                        byte extraction, Lyapunov estimator. No Python
                        dependency — usable from any Rust project.
  entropyhub-py/        PyO3 bindings around entropyhub-core.
    python/entropyhub/  the `entropyhub` Python package (EntropyHub class).
examples/
  demo.py               end-to-end demo / smoke test.
```

`entropyhub-core` is publishable to crates.io on its own for Rust consumers;
`entropyhub-py` builds (via [maturin](https://www.maturin.rs/)) into the
`entropyhub` wheel that Python consumers install from PyPI.

## Building from source

```bash
# Rust: run the chaos-verification test suite
cargo test

# Python: build and install the extension into your active environment
cd crates/entropyhub-py
pip install maturin
maturin develop --release   # or: maturin build --release && pip install target/wheels/*.whl

# Try it
cd ../..
python examples/demo.py
```

## API

```python
class EntropyHub:
    def __init__(self, dt: float = 0.01): ...
    def reseed(self) -> None: ...
    def random_bytes(self, n: int, iterations: int = 1) -> bytes: ...
    def random_int(self, lo: int, hi: int) -> int: ...
    def random_float(self) -> float: ...
    def verify_chaos(self, total_steps=2_000_000, renorm_every=50) -> float: ...
    @property
    def state(self) -> tuple[float, float, float]: ...
```

The equivalent pure-Rust API lives in `entropyhub_core::RosslerCore`.

## License

Dual-licensed under [MIT](LICENSE-MIT) or [Apache-2.0](LICENSE-APACHE), your
choice — the Rust ecosystem convention.

## Contributing

Issues and PRs welcome. If you touch the integrator, step size, or default
parameters, `cargo test` will fail if the change makes the system
non-chaotic — please don't work around that test without re-verifying the
Lyapunov exponent by hand first.
