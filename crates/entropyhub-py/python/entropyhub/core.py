"""Python wrapper around the compiled `entropyhub._core` (Rust/PyO3) extension.

The Rust core integrates the Rössler system with RK4 (verified via Benettin's
method to have a largest Lyapunov exponent of ~0.071, matching the ~0.0714
literature value for these parameters -- see entropyhub-core's crate docs and
tests/chaos_verification.rs for the verification). This is a deterministic
PRNG seeded from OS entropy: its unpredictability rests entirely on that seed
staying secret, not on any inherent "true" randomness in the chaotic dynamics
themselves. It has not been independently cryptanalyzed; do not treat it as a
drop-in replacement for a vetted CSPRNG in security-critical contexts.
"""

from __future__ import annotations

from . import _core

LITERATURE_LYAPUNOV = 0.0714


class EntropyHub:
    """A chaos-seeded PRNG backed by the Rust Rössler/RK4 core."""

    def __init__(self, dt: float = 0.01):
        self._core = _core.EntropyHubCore.from_os_entropy(dt)

    def reseed(self) -> None:
        """Reseeds the underlying chaotic state from fresh OS entropy."""
        self._core.reseed_from_os_entropy()

    def random_bytes(self, n: int, iterations: int = 1) -> bytes:
        """Returns `n` random bytes.

        `iterations` is the number of RK4 steps advanced between output
        bytes; higher values move the state further along the attractor
        between samples at the cost of speed. SHA-256 whitening inside
        decide_rust means iterations=1 already passes standard statistical
        randomness tests (verified empirically), so this mainly matters if
        you want output samples to be phase-space-distant, not just
        hash-distant.
        """
        if n < 0:
            raise ValueError("n must be >= 0")
        return bytes(self._core.decide_rust(iterations) for _ in range(n))

    def random_int(self, lo: int, hi: int) -> int:
        """Uniform random integer in [lo, hi], inclusive, via rejection sampling."""
        if lo > hi:
            raise ValueError("lo must be <= hi")
        span = hi - lo + 1
        n_bytes = max(1, (span.bit_length() + 7) // 8)
        limit = (1 << (n_bytes * 8)) - (1 << (n_bytes * 8)) % span
        while True:
            raw = int.from_bytes(self.random_bytes(n_bytes), "big")
            if raw < limit:
                return lo + raw % span

    def random_float(self) -> float:
        """Uniform random float in [0, 1)."""
        raw = int.from_bytes(self.random_bytes(8), "big")
        return raw / 2**64

    def verify_chaos(self, total_steps: int = 2_000_000, renorm_every: int = 50) -> float:
        """Estimates the largest Lyapunov exponent of the live instance via
        Benettin's method (a shadow trajectory perturbed by 1e-8, periodically
        renormalized). A result well above 0 (literature value ~0.0714) is
        direct, checkable evidence this instance is currently chaotic, rather
        than an assumption based on the parameters alone. Does not disturb
        the instance's own trajectory.
        """
        return self._core.estimate_lyapunov_rust(total_steps, renorm_every)

    @property
    def state(self) -> tuple[float, float, float]:
        """Current (x, y, z) position on the attractor."""
        return (self._core.x, self._core.y, self._core.z)
