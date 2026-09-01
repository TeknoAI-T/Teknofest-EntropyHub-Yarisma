//! Pure-Rust core for EntropyHub: an RK4-integrated Rössler chaotic system,
//! OS-seeded, with a built-in Lyapunov-exponent self-check.
//!
//! ## Why RK4 and not Euler
//!
//! An earlier version of this system integrated the Rössler equations with
//! explicit Euler at dt=0.01. Verified via Benettin's method over multi-million-step
//! horizons that this numerically damps the system to a largest Lyapunov exponent
//! of ~0.00000 -- i.e. **not measurably chaotic** -- despite using the textbook
//! "chaotic" parameters (a=0.2, b=0.2, c=5.7). RK4 restores lambda ~ 0.071,
//! matching the ~0.0714 literature value for this parameter set. See
//! `tests/chaos_verification.rs`, which fails the build if this regresses.
//!
//! ## What this is, and what it is not
//!
//! This is a **deterministic PRNG**: given the same seed, it always produces the
//! same output. Its unpredictability depends entirely on the seed staying secret
//! (by default drawn from OS entropy via [`RosslerCore::from_os_entropy`]), not on
//! any inherent "true" randomness in the chaotic dynamics. It has not been
//! independently cryptanalyzed and should not be treated as a drop-in replacement
//! for a vetted CSPRNG (e.g. ChaCha20) in security-critical contexts.

use sha2::{Digest, Sha256};

/// Rössler system state and parameters, integrated with 4th-order Runge-Kutta.
#[derive(Debug, Clone, Copy)]
pub struct RosslerCore {
    pub x: f64,
    pub y: f64,
    pub z: f64,
    a: f64,
    b: f64,
    c: f64,
    dt: f64,
}

/// Parameters verified (via [`RosslerCore::estimate_lyapunov`]) to produce a
/// largest Lyapunov exponent of ~0.071 under RK4 at dt=0.01.
pub const CHAOTIC_PARAMS: (f64, f64, f64) = (0.2, 0.2, 5.7);

/// The literature value of the largest Lyapunov exponent for [`CHAOTIC_PARAMS`].
pub const LITERATURE_LYAPUNOV: f64 = 0.0714;

impl RosslerCore {
    /// Builds an instance from caller-supplied state and parameters. Fully
    /// deterministic and reproducible -- use [`RosslerCore::from_os_entropy`]
    /// unless you specifically need reproducibility (e.g. tests).
    pub fn new(x: f64, y: f64, z: f64, a: f64, b: f64, c: f64, dt: f64) -> Self {
        RosslerCore { x, y, z, a, b, c, dt }
    }

    /// Builds an instance seeded from OS entropy using [`CHAOTIC_PARAMS`],
    /// then burns in 10,000 steps so the returned state already sits on the
    /// attractor rather than in the initial transient.
    pub fn from_os_entropy(dt: f64) -> Result<Self, getrandom::Error> {
        let (x, y, z) = seed_from_os_entropy()?;
        let (a, b, c) = CHAOTIC_PARAMS;
        let mut core = RosslerCore { x, y, z, a, b, c, dt };
        for _ in 0..10_000 {
            core.step();
        }
        Ok(core)
    }

    /// Reseeds from fresh OS entropy and burns in 10,000 steps.
    pub fn reseed_from_os_entropy(&mut self) -> Result<(), getrandom::Error> {
        let (x, y, z) = seed_from_os_entropy()?;
        self.x = x;
        self.y = y;
        self.z = z;
        for _ in 0..10_000 {
            self.step();
        }
        Ok(())
    }

    /// Reseeds with caller-supplied state (deterministic, reproducible).
    pub fn reseed(&mut self, x: f64, y: f64, z: f64) {
        self.x = x;
        self.y = y;
        self.z = z;
    }

    #[inline]
    fn deriv(&self, x: f64, y: f64, z: f64) -> (f64, f64, f64) {
        (-y - z, x + self.a * y, self.b + z * (x - self.c))
    }

    /// One 4th-order Runge-Kutta integration step.
    #[inline]
    pub fn step(&mut self) {
        let (k1x, k1y, k1z) = self.deriv(self.x, self.y, self.z);
        let (k2x, k2y, k2z) = self.deriv(
            self.x + 0.5 * self.dt * k1x,
            self.y + 0.5 * self.dt * k1y,
            self.z + 0.5 * self.dt * k1z,
        );
        let (k3x, k3y, k3z) = self.deriv(
            self.x + 0.5 * self.dt * k2x,
            self.y + 0.5 * self.dt * k2y,
            self.z + 0.5 * self.dt * k2z,
        );
        let (k4x, k4y, k4z) = self.deriv(
            self.x + self.dt * k3x,
            self.y + self.dt * k3y,
            self.z + self.dt * k3z,
        );

        self.x += self.dt / 6.0 * (k1x + 2.0 * k2x + 2.0 * k3x + k4x);
        self.y += self.dt / 6.0 * (k1y + 2.0 * k2y + 2.0 * k3y + k4y);
        let new_z = self.z + self.dt / 6.0 * (k1z + 2.0 * k2z + 2.0 * k3z + k4z);

        // Defensive bound only: the verified chaotic trajectory stays within
        // roughly [0, 27], so this does not trigger in normal operation.
        self.z = new_z.rem_euclid(1000.0);
    }

    /// Advances `iterations` steps and extracts one byte: SHA-256 of the
    /// state, XOR of the hash's first two bytes.
    pub fn decide(&mut self, iterations: usize) -> u8 {
        for _ in 0..iterations {
            self.step();
        }
        let data = format!("{}:{}:{}", self.x, self.y, self.z);
        let mut hasher = Sha256::new();
        hasher.update(data.as_bytes());
        let result = hasher.finalize();
        result[0] ^ result[1]
    }

    /// Generates a trajectory of `steps` (x, y, z) triples, flattened.
    pub fn trajectory(&mut self, steps: usize) -> Vec<f64> {
        let mut traj = Vec::with_capacity(steps * 3);
        for _ in 0..steps {
            self.step();
            traj.push(self.x);
            traj.push(self.y);
            traj.push(self.z);
        }
        traj
    }

    /// Estimates the largest Lyapunov exponent of this instance's current
    /// (a, b, c, dt) via Benettin's method: a shadow trajectory perturbed by
    /// 1e-8, periodically renormalized. A result well above 0 (literature:
    /// ~0.0714 for [`CHAOTIC_PARAMS`]) is direct, checkable evidence the
    /// system is actually chaotic right now, rather than an assumption based
    /// on the parameter values alone. Does not disturb this instance's own
    /// trajectory.
    pub fn estimate_lyapunov(&self, total_steps: usize, renorm_every: usize) -> f64 {
        let d0 = 1e-8;
        let mut sys = *self;
        let mut pert = *self;
        pert.x += d0;

        let mut sum_log = 0.0;
        let mut n_renorm: usize = 0;
        let mut steps_done: usize = 0;
        while steps_done < total_steps {
            for _ in 0..renorm_every {
                sys.step();
                pert.step();
            }
            steps_done += renorm_every;

            let dx = pert.x - sys.x;
            let dy = pert.y - sys.y;
            let dz = pert.z - sys.z;
            let d1 = (dx * dx + dy * dy + dz * dz).sqrt();

            if d1 > 0.0 {
                sum_log += (d1 / d0).ln();
                n_renorm += 1;
                let scale = d0 / d1;
                pert.x = sys.x + dx * scale;
                pert.y = sys.y + dy * scale;
                pert.z = sys.z + dz * scale;
            }
        }
        sum_log / (n_renorm as f64 * renorm_every as f64 * self.dt)
    }
}

fn seed_from_os_entropy() -> Result<(f64, f64, f64), getrandom::Error> {
    let mut buf = [0u8; 24];
    getrandom::getrandom(&mut buf)?;
    let to_unit = |b: &[u8]| -> f64 {
        let v = u64::from_le_bytes(b.try_into().unwrap());
        (v as f64) / (u64::MAX as f64) // in [0, 1)
    };
    // Seed inside the attractor's natural basin (away from the unstable
    // origin) so burn-in reliably lands on the attractor.
    let x = 5.0 + 10.0 * to_unit(&buf[0..8]);
    let y = 5.0 + 10.0 * to_unit(&buf[8..16]);
    let z = 5.0 + 10.0 * to_unit(&buf[16..24]);
    Ok((x, y, z))
}
