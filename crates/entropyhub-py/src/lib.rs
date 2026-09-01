//! Thin PyO3 wrapper around `entropyhub_core::RosslerCore`. All logic lives
//! in the pure-Rust `entropyhub-core` crate; this crate only translates
//! between Rust and Python types.

use entropyhub_core::RosslerCore;
use numpy::{IntoPyArray, PyArray1};
use pyo3::exceptions::PyRuntimeError;
use pyo3::prelude::*;

#[pyclass(name = "EntropyHubCore")]
struct PyEntropyHubCore {
    inner: RosslerCore,
}

#[pymethods]
impl PyEntropyHubCore {
    #[new]
    fn new(x: f64, y: f64, z: f64, a: f64, b: f64, c: f64, dt: f64) -> Self {
        PyEntropyHubCore { inner: RosslerCore::new(x, y, z, a, b, c, dt) }
    }

    /// Builds an instance seeded from OS entropy using the verified-chaotic
    /// parameter set (a=0.2, b=0.2, c=5.7).
    #[staticmethod]
    fn from_os_entropy(dt: f64) -> PyResult<Self> {
        RosslerCore::from_os_entropy(dt)
            .map(|inner| PyEntropyHubCore { inner })
            .map_err(|e| PyRuntimeError::new_err(format!("OS entropy read failed: {e}")))
    }

    /// Reseeds from fresh OS entropy instead of a caller-supplied (and
    /// therefore potentially predictable) state.
    fn reseed_from_os_entropy(&mut self) -> PyResult<()> {
        self.inner
            .reseed_from_os_entropy()
            .map_err(|e| PyRuntimeError::new_err(format!("OS entropy read failed: {e}")))
    }

    /// Reseeds the chaotic system with caller-supplied state variables.
    fn reseed_rust(&mut self, new_x: f64, new_y: f64, new_z: f64) {
        self.inner.reseed(new_x, new_y, new_z);
    }

    /// Executes N steps and extracts one byte (SHA-256 of the state, XOR of
    /// the hash's first two bytes).
    fn decide_rust(&mut self, iterations: usize) -> u8 {
        self.inner.decide(iterations)
    }

    /// Generates a trajectory of (x, y, z) states over N steps.
    fn get_trajectory_rust<'py>(&mut self, py: Python<'py>, steps: usize) -> PyResult<Py<PyArray1<f64>>> {
        let traj = self.inner.trajectory(steps);
        Ok(traj.into_pyarray_bound(py).to_owned().unbind())
    }

    /// Estimates the largest Lyapunov exponent of this instance's current
    /// trajectory via Benettin's method. A result well above 0 (literature:
    /// ~0.0714) is direct, checkable evidence the instance is currently
    /// chaotic. Does not disturb this instance's own trajectory.
    fn estimate_lyapunov_rust(&self, total_steps: usize, renorm_every: usize) -> f64 {
        self.inner.estimate_lyapunov(total_steps, renorm_every)
    }

    #[getter(x)]
    fn get_x(&self) -> f64 { self.inner.x }
    #[setter(x)]
    fn set_x(&mut self, v: f64) { self.inner.x = v; }

    #[getter(y)]
    fn get_y(&self) -> f64 { self.inner.y }
    #[setter(y)]
    fn set_y(&mut self, v: f64) { self.inner.y = v; }

    #[getter(z)]
    fn get_z(&self) -> f64 { self.inner.z }
    #[setter(z)]
    fn set_z(&mut self, v: f64) { self.inner.z = v; }
}

#[pymodule]
fn _core(_py: Python<'_>, m: &Bound<'_, PyModule>) -> PyResult<()> {
    m.add_class::<PyEntropyHubCore>()?;
    Ok(())
}
