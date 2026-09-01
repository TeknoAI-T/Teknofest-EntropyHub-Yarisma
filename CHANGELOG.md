# Changelog

All notable changes to this project are documented here.
Format loosely follows [Keep a Changelog](https://keepachangelog.com/).

## [0.1.0] - Unreleased

### Fixed
- Replaced the explicit Euler integrator (dt=0.01) with 4th-order Runge-Kutta.
  The Euler version used chaotic Rössler parameters (a=0.2, b=0.2, c=5.7) but
  measured (Benettin's method) at a largest Lyapunov exponent of ~0.00000 —
  not actually chaotic. RK4 restores λ ≈ 0.071, matching the ~0.0714
  literature value.

### Added
- `entropyhub-core`: pure-Rust crate with no Python dependency, publishable
  to crates.io independently of the Python bindings.
- OS-entropy seeding (`from_os_entropy`, `reseed_from_os_entropy`) — the
  previous API had no entropy source at all and relied entirely on the
  caller supplying a seed.
- `estimate_lyapunov` / `verify_chaos()` — runtime self-check that measures
  the instance's actual Lyapunov exponent instead of assuming chaos from the
  parameter values.
- `tests/chaos_verification.rs` — regression test suite that fails the build
  if a future change makes the system non-chaotic again.
- Python package restructured into a proper `entropyhub` distribution built
  via maturin, importable as `pip install entropyhub` instead of manual
  `.dll` → `.pyd` copying.

### Removed
- The rest of the original project (API server, PQC bindings, benchmarks,
  formal verification, frontend) is out of scope for this library and was
  removed prior to this repository's initial commit.
