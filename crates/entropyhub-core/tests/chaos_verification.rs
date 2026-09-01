//! Regression test guarding the core claim of this crate: the system must
//! actually be chaotic (positive largest Lyapunov exponent), not just use
//! parameters that are chaotic in the continuous-time limit. An earlier Euler
//! integrator passed the latter but failed the former (see crate docs). If a
//! future change to the integrator or step size silently kills the chaos
//! again, this test is what catches it.

use entropyhub_core::{RosslerCore, CHAOTIC_PARAMS, LITERATURE_LYAPUNOV};

#[test]
fn chaotic_params_are_actually_chaotic() {
    let (a, b, c) = CHAOTIC_PARAMS;
    let core = RosslerCore::new(1.0, 1.0, 1.0, a, b, c, 0.01);
    let lambda = core.estimate_lyapunov(500_000, 50);
    assert!(
        lambda > 0.04,
        "expected largest Lyapunov exponent near {LITERATURE_LYAPUNOV}, got {lambda}"
    );
}

#[test]
fn periodic_params_are_not_chaotic() {
    // Same system, a limit-cycle parameter regime (c=2.5 instead of 5.7).
    let core = RosslerCore::new(1.0, 1.0, 1.0, 0.2, 0.2, 2.5, 0.01);
    let lambda = core.estimate_lyapunov(500_000, 50);
    assert!(
        lambda.abs() < 0.02,
        "expected a near-zero exponent for a non-chaotic limit cycle, got {lambda}"
    );
}

#[test]
fn trajectory_stays_bounded() {
    let (a, b, c) = CHAOTIC_PARAMS;
    let mut core = RosslerCore::new(1.0, 1.0, 1.0, a, b, c, 0.01);
    for _ in 0..10_000 {
        core.step();
    }
    for _ in 0..200_000 {
        core.step();
        assert!(core.x.is_finite() && core.y.is_finite() && core.z.is_finite());
        assert!(core.x.abs() < 100.0 && core.y.abs() < 100.0 && core.z.abs() < 100.0);
    }
}

#[test]
fn from_os_entropy_seeds_are_not_fixed() {
    let a = RosslerCore::from_os_entropy(0.01).unwrap();
    let b = RosslerCore::from_os_entropy(0.01).unwrap();
    assert!(
        (a.x - b.x).abs() > 1e-6 || (a.y - b.y).abs() > 1e-6 || (a.z - b.z).abs() > 1e-6,
        "two OS-seeded instances landed on (almost) the same state"
    );
}

#[test]
fn decide_produces_varying_bytes() {
    let (a, b, c) = CHAOTIC_PARAMS;
    let mut core = RosslerCore::new(1.0, 1.0, 1.0, a, b, c, 0.01);
    let bytes: Vec<u8> = (0..64).map(|_| core.decide(1)).collect();
    let distinct: std::collections::HashSet<u8> = bytes.iter().copied().collect();
    assert!(distinct.len() > 32, "output looks degenerate: {bytes:?}");
}
