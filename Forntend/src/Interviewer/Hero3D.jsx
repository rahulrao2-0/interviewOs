import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef } from "react";

function Box() {
  const ref = useRef();

  // 🔥 Smooth rotation animation
  useFrame(() => {
    ref.current.rotation.y += 0.01;
    ref.current.rotation.x += 0.005;
  });

  return (
    <mesh ref={ref}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="#ff5a5f" roughness={0.3} metalness={0.6} />
    </mesh>
  );
}

export default function Hero3D() {
  return (
    <div style={styles.container}>
      <Canvas camera={{ position: [4, 3, 6], fov: 50 }}>
        {/* 🌟 Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-5, -5, -5]} intensity={0.5} />

        {/* 🧊 Object */}
        <Box />

        {/* 🎮 Controls */}
        <OrbitControls enableZoom={false} />

      </Canvas>

      {/* 🔥 Overlay Text */}
      <div style={styles.overlay}>
        <h1 style={styles.title}>Explore Your Next Stay</h1>
        <p style={styles.subtitle}>Find the best hotels & experiences</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    position: "relative",
    height: "350px",
    width: "100%",
    borderRadius: "20px",
    overflow: "hidden",
    background: "linear-gradient(135deg, #ff5a5f, #6c63ff)",
  },

  overlay: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    textAlign: "center",
    color: "white",
    pointerEvents: "none",
  },

  title: {
    fontSize: "28px",
    fontWeight: "600",
    marginBottom: "10px",
  },

  subtitle: {
    fontSize: "14px",
    opacity: 0.9,
  },
};