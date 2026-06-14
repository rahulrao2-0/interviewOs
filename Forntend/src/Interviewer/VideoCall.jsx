import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useNavigate, useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { useAuth } from "../AuthContext.jsx";

const socket = io("https://interviewos.online", { withCredentials: true });

const LANGUAGES = ["javascript", "python", "java", "cpp", "typescript", "go"];

function useTimer() {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);
  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${m}:${s}`;
}

export default function VideoCall() {
  const [code, setCode] = useState("// Start coding here...\n");
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState("");
  const [outputVisible, setOutputVisible] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [connected, setConnected] = useState(false);
  const [openInbox, setOpenInbox] = useState(false);
  const [inboxUsers, setInboxUsers] = useState([]);

  const { roomId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const timer = useTimer();

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const userRef = useRef(null);

  if (user?.user?.role === "interviewer") userRef.current = true;

  const peerConfig = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localStreamRef.current = stream;
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      setConnected(true);
    } catch (err) {
      console.error(err);
    }
  };

  const createPeerConnection = () => {
    const pc = new RTCPeerConnection(peerConfig);
    pc.onicecandidate = (e) => {
      if (e.candidate) socket.emit("ice_candidate", { roomId, candidate: e.candidate });
    };
    pc.ontrack = (e) => {
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = e.streams[0];
    };
    localStreamRef.current?.getTracks().forEach((t) => pc.addTrack(t, localStreamRef.current));
    peerConnectionRef.current = pc;
    return pc;
  };

  const handleCodeChange = (value) => {
    setCode(value);
    socket.emit("code-change", { roomId, code: value });
  };

  useEffect(() => {
    socket.on("code-update", (newCode) => setCode(newCode));
    return () => socket.off("code-update");
  }, []);

  useEffect(() => {
    const username = "Guest";
    const init = async () => {
      await startCamera();
      socket.emit("join_video_room", { roomId, username });
    };

    const handleUserJoined = async () => {
      const pc = createPeerConnection();
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket.emit("video_offer", { roomId, offer });
    };

    const handleOffer = async ({ offer }) => {
      const pc = createPeerConnection();
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit("video_answer", { roomId, answer });
    };

    const handleAnswer = async ({ answer }) => {
      if (peerConnectionRef.current)
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
    };

    const handleIceCandidate = async ({ candidate }) => {
      if (peerConnectionRef.current)
        await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
    };

    init();
    socket.on("user_joined_video", handleUserJoined);
    socket.on("video_offer", handleOffer);
    socket.on("video_answer", handleAnswer);
    socket.on("ice_candidate", handleIceCandidate);

    return () => {
      socket.off("user_joined_video", handleUserJoined);
      socket.off("video_offer", handleOffer);
      socket.off("video_answer", handleAnswer);
      socket.off("ice_candidate", handleIceCandidate);
      socket.emit("leave_video_room", { roomId });
      localStreamRef.current?.getTracks().forEach((t) => t.stop());
      peerConnectionRef.current?.close();
    };
  }, [roomId]);

  const handleEndCall = () => {
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    peerConnectionRef.current?.close();
    socket.emit("leave_video_room", { roomId });
    navigate("/");
  };

  const handleToggleMic = () => {
    const track = localStreamRef.current?.getTracks().find((t) => t.kind === "audio");
    if (track) { track.enabled = !track.enabled; setMicOn(track.enabled); }
  };

  const handleToggleCamera = () => {
    const track = localStreamRef.current?.getTracks().find((t) => t.kind === "video");
    if (track) { track.enabled = !track.enabled; setCameraOn(track.enabled); }
  };

  const handleRunCode = () => {
    setOutput(`Running ${language}...\n> [Execution output would appear here]`);
    setOutputVisible(true);
  };

  const handleSend = async () => {
    try {
      const res = await fetch("https://interviewos.online/api/interviewer-inbox-users", {
        method: "GET", credentials: "include",
      });
      const data = await res.json();
      if (data.success) { setInboxUsers(data.users); setOpenInbox(true); }
    } catch (err) { console.error(err); }
  };

  const handleSendRoomId = async (receiverId) => {
    const message = `You are invited to an interview.\n\nRoom ID: ${roomId}\n\nJoin Here: https://interviewos.online/call/${roomId}`;
    await fetch("https://interviewos.online/api/save-message", {
      method: "POST", credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ receiverId, text: message }),
    });
    socket.emit("send_message", { receiverId, text: message });
    setOpenInbox(false);
  };

  return (
    <div style={styles.root}>
      {/* ── TOP BAR ── */}
      <div style={styles.topBar}>
        <div style={styles.topLeft}>
          <span style={styles.logo}>⬡ InterviewOS</span>
          <span style={styles.divider}>|</span>
          <span style={styles.roomLabel}>Room: <code style={styles.roomId}>{roomId}</code></span>
        </div>
        <div style={styles.topCenter}>
          <span style={{ ...styles.dot, background: connected ? "#22c55e" : "#f59e0b" }} />
          <span style={styles.statusText}>{connected ? "Connected" : "Connecting…"}</span>
        </div>
        <div style={styles.topRight}>
          <span style={styles.timer}>⏱ {timer}</span>
          {user?.user?.role === "interviewer" && (
            <button style={styles.inviteBtn} onClick={handleSend}>Invite Candidate</button>
          )}
        </div>
      </div>

      {/* ── MAIN AREA ── */}
      <div style={styles.main}>
        {/* LEFT PANEL — Videos + Controls */}
        <div style={styles.leftPanel}>
          <div style={styles.remoteVideoWrap}>
            <video ref={remoteVideoRef} autoPlay playsInline style={styles.videoFull} />
            <div style={styles.videoLabel}>Candidate</div>
            <div style={styles.pipWrap}>
              <video ref={localVideoRef} autoPlay muted playsInline style={styles.pipVideo} />
              <div style={styles.pipLabel}>You</div>
            </div>
          </div>

          <div style={styles.controlsBar}>
            <ControlBtn onClick={handleToggleMic} active={micOn} icon={micOn ? "🎙️" : "🔇"} label={micOn ? "Mute" : "Unmute"} />
            <ControlBtn onClick={handleToggleCamera} active={cameraOn} icon={cameraOn ? "📷" : "🚫"} label={cameraOn ? "Cam Off" : "Cam On"} />
            <ControlBtn icon="🖥️" label="Share" onClick={() => {}} active={true} />
            <button style={styles.runBtnControl} onClick={handleRunCode}>▶ Run</button>
            <div style={styles.flexGrow} />
            <button style={styles.endBtn} onClick={handleEndCall}>
              <span style={{ fontSize: 16 }}>📵</span> End Call
            </button>
          </div>
        </div>

        {/* RIGHT PANEL — Editor only */}
        <div style={styles.rightPanel}>
          {/* Editor toolbar */}
          <div style={styles.editorToolbar}>
            <span style={styles.editorTitle}>Coding Round</span>
            <div style={styles.toolbarSpacer} />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              style={styles.langSelect}
            >
              {LANGUAGES.map((l) => (
                <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>
              ))}
            </select>
            <button style={styles.runBtnToolbar} onClick={handleRunCode}>▶ Run Code</button>
          </div>

          {/* Monaco Editor */}
          <div style={styles.editorWrap}>
            <Editor
              height="100%"
              language={language}
              value={code}
              onChange={handleCodeChange}
              theme="vs-dark"
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                padding: { top: 12 },
              }}
            />
          </div>

          {/* Output Console */}
          <div style={styles.outputConsole}>
            <div style={styles.consoleHeader}>
              <span style={styles.consoleTitle}>⬛ Output Console</span>
              <button style={styles.consoleToggle} onClick={() => setOutputVisible((v) => !v)}>
                {outputVisible ? "▾ Hide" : "▸ Show"}
              </button>
            </div>
            {outputVisible && (
              <pre style={styles.consoleOutput}>
                {output || "// Output will appear here after running code"}
              </pre>
            )}
          </div>
        </div>
      </div>

      {/* INBOX MODAL */}
      {openInbox && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <span style={styles.modalTitle}>Select Candidate</span>
              <button style={styles.modalClose} onClick={() => setOpenInbox(false)}>✕</button>
            </div>
            {inboxUsers.length === 0 ? (
              <p style={styles.emptyState}>No candidates found.</p>
            ) : (
              <ul style={styles.userList}>
                {inboxUsers.map((u) => (
                  <li key={u.user_id} style={styles.userItem} onClick={() => handleSendRoomId(u.user_id)}>
                    <div style={styles.userAvatar}>{u.name?.[0]?.toUpperCase() || "?"}</div>
                    <span style={styles.userName}>{u.name}</span>
                    <span style={styles.sendArrow}>→</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ControlBtn({ icon, label, onClick, active }) {
  return (
    <button
      onClick={onClick}
      style={{
        ...styles.ctrlBtn,
        background: active ? "rgba(255,255,255,0.08)" : "rgba(239,68,68,0.15)",
        border: active ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(239,68,68,0.4)",
      }}
    >
      <span style={{ fontSize: 18 }}>{icon}</span>
      <span style={styles.ctrlLabel}>{label}</span>
    </button>
  );
}

const styles = {
  root: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    width: "100vw",
    background: "#0d1117",
    color: "#e6edf3",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    overflow: "hidden",
  },

  /* TOP BAR */
  topBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 20px",
    height: 52,
    background: "#161b22",
    borderBottom: "1px solid #30363d",
    flexShrink: 0,
    gap: 12,
  },
  topLeft: { display: "flex", alignItems: "center", gap: 10 },
  logo: { fontWeight: 700, fontSize: 16, color: "#f0f6fc", letterSpacing: ".03em" },
  divider: { color: "#30363d", fontSize: 18 },
  roomLabel: { fontSize: 13, color: "#8b949e" },
  roomId: { color: "#79c0ff", background: "#0d1117", padding: "2px 6px", borderRadius: 4 },
  topCenter: { display: "flex", alignItems: "center", gap: 6 },
  dot: { width: 8, height: 8, borderRadius: "50%", display: "inline-block" },
  statusText: { fontSize: 13, color: "#8b949e" },
  topRight: { display: "flex", alignItems: "center", gap: 12 },
  timer: { fontVariantNumeric: "tabular-nums", fontSize: 15, color: "#e6edf3", fontWeight: 600 },
  inviteBtn: {
    background: "#238636", color: "#fff", border: "none",
    padding: "6px 14px", borderRadius: 6, fontSize: 13,
    cursor: "pointer", fontWeight: 600,
  },

  /* MAIN */
  main: { display: "flex", flex: 1, overflow: "hidden" },

  /* LEFT PANEL */
  leftPanel: {
    display: "flex",
    flexDirection: "column",
    width: 340,
    minWidth: 260,
    flexShrink: 0,
    borderRight: "1px solid #30363d",
  },
  remoteVideoWrap: {
    flex: 1,
    position: "relative",
    background: "#000",
    overflow: "hidden",
  },
  videoFull: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
  videoLabel: {
    position: "absolute", bottom: 12, left: 12,
    background: "rgba(0,0,0,0.7)", color: "#fff",
    fontSize: 12, padding: "3px 8px", borderRadius: 4, fontWeight: 600,
  },
  pipWrap: {
    position: "absolute", bottom: 12, right: 12,
    width: 100, height: 72,
    borderRadius: 8, overflow: "hidden",
    border: "2px solid #30363d", background: "#000",
  },
  pipVideo: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
  pipLabel: {
    position: "absolute", bottom: 4, left: 4,
    background: "rgba(0,0,0,0.7)", color: "#fff",
    fontSize: 10, padding: "1px 5px", borderRadius: 3,
  },

  /* CONTROLS */
  controlsBar: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 12px",
    background: "#161b22",
    borderTop: "1px solid #30363d",
    flexShrink: 0,
    flexWrap: "wrap",
  },
  ctrlBtn: {
    display: "flex", flexDirection: "column", alignItems: "center",
    gap: 2, padding: "6px 10px", borderRadius: 8,
    cursor: "pointer", color: "#e6edf3", fontSize: 11, minWidth: 48,
  },
  ctrlLabel: { fontSize: 10, color: "#8b949e" },
  runBtnControl: {
    padding: "6px 14px", background: "#238636", color: "#fff",
    border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: 13,
  },
  flexGrow: { flex: 1 },
  endBtn: {
    display: "flex", alignItems: "center", gap: 6,
    padding: "6px 14px", background: "#da3633", color: "#fff",
    border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: 13,
  },

  /* RIGHT PANEL */
  rightPanel: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    minWidth: 0,
  },

  /* EDITOR TOOLBAR */
  editorToolbar: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "0 16px",
    height: 48,
    background: "#161b22",
    borderBottom: "1px solid #30363d",
    flexShrink: 0,
  },
  editorTitle: { fontSize: 13, fontWeight: 700, color: "#f0f6fc" },
  toolbarSpacer: { flex: 1 },
  langSelect: {
    background: "#0d1117", color: "#e6edf3",
    border: "1px solid #30363d", borderRadius: 6,
    padding: "4px 10px", fontSize: 13, cursor: "pointer", outline: "none",
  },
  runBtnToolbar: {
    padding: "6px 16px", background: "#238636", color: "#fff",
    border: "none", borderRadius: 6, fontWeight: 700, cursor: "pointer", fontSize: 13,
  },

  /* EDITOR */
  editorWrap: { flex: 1, overflow: "hidden", background: "#1e1e1e" },

  /* OUTPUT CONSOLE */
  outputConsole: {
    borderTop: "1px solid #30363d",
    background: "#0d1117",
    flexShrink: 0,
    maxHeight: 180,
  },
  consoleHeader: {
    display: "flex", alignItems: "center", gap: 10,
    padding: "8px 16px",
    background: "#161b22",
    borderBottom: "1px solid #21262d",
  },
  consoleTitle: {
    fontSize: 12, fontWeight: 700, color: "#8b949e",
    textTransform: "uppercase", letterSpacing: ".05em", flex: 1,
  },
  consoleToggle: {
    background: "transparent", color: "#8b949e",
    border: "none", cursor: "pointer", fontSize: 12, padding: "2px 6px",
  },
  consoleOutput: {
    margin: 0, padding: "12px 16px",
    fontSize: 13, color: "#3fb950",
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    background: "#0d1117",
    minHeight: 60, maxHeight: 140,
    overflowY: "auto", whiteSpace: "pre-wrap",
  },

  /* MODAL */
  modalOverlay: {
    position: "fixed", inset: 0,
    background: "rgba(0,0,0,0.7)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    background: "#161b22", border: "1px solid #30363d",
    borderRadius: 12, width: 360, maxHeight: "80vh", overflow: "auto",
  },
  modalHeader: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "16px 20px", borderBottom: "1px solid #30363d",
  },
  modalTitle: { fontWeight: 700, fontSize: 15, color: "#f0f6fc" },
  modalClose: { background: "transparent", color: "#8b949e", border: "none", cursor: "pointer", fontSize: 16 },
  emptyState: { padding: "24px 20px", color: "#8b949e", fontSize: 14, textAlign: "center" },
  userList: { listStyle: "none", margin: 0, padding: 0 },
  userItem: {
    display: "flex", alignItems: "center", gap: 12,
    padding: "12px 20px", cursor: "pointer",
    borderBottom: "1px solid #21262d",
  },
  userAvatar: {
    width: 34, height: 34, borderRadius: "50%",
    background: "#238636", color: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: 700, fontSize: 14, flexShrink: 0,
  },
  userName: { flex: 1, fontSize: 14, color: "#e6edf3" },
  sendArrow: { color: "#388bfd", fontSize: 16 },
};