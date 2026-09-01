"""Demo / self-check for the EntropyHub Rust-backed chaotic PRNG.

Run: python demo.py
"""

import numpy as np

from entropyhub import EntropyHub
from entropyhub.core import LITERATURE_LYAPUNOV


def main():
    hub = EntropyHub()
    print("Seeded state (x, y, z):", tuple(round(v, 4) for v in hub.state))

    lam = hub.verify_chaos()
    print(f"Estimated largest Lyapunov exponent: {lam:.5f} (literature: ~{LITERATURE_LYAPUNOV})")
    if lam <= 0.01:
        print("WARNING: this instance does not appear chaotic (lambda too low).")

    data = np.frombuffer(hub.random_bytes(1_000_000), dtype=np.uint8)
    counts = np.bincount(data, minlength=256)
    probs = counts / len(data)
    nz = probs[probs > 0]
    entropy = -np.sum(nz * np.log2(nz))
    print(f"Shannon entropy over {len(data)} bytes: {entropy:.4f} bits/byte (ideal 8.0)")

    print("random_int(1, 6) x10 (dice rolls):", [hub.random_int(1, 6) for _ in range(10)])
    print("random_float() x5:", [round(hub.random_float(), 4) for _ in range(5)])


if __name__ == "__main__":
    main()
