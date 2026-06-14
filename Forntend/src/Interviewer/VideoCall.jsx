import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";


import {
  Box,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

import {
  CallEnd,
  Mic,
  MicOff,
  Videocam,
  VideocamOff,
} from "@mui/icons-material";

import { useAuth } from "../AuthContext.jsx"

const socket = io("https://interviewos.online", {
  withCredentials: true,
});

export default function VideoCall() {
  const [code, setCode] = useState("// Start coding...");
  const { roomId } = useParams();

  const { user } = useAuth();

  console.log(user?.user?.user_id)




  const navigate = useNavigate();

  const username = location.state?.username || "Guest";

  const userRef = useRef(null);

  const localVideoRef = useRef(null);

  const remoteVideoRef = useRef(null);

  const localStreamRef = useRef(null);

  const peerConnectionRef = useRef(null);

  const [micOn, setMicOn] = useState(true);

  const [cameraOn, setCameraOn] = useState(true);

  const [openInbox, setOpenInbox] = useState(false);

  const [inboxUsers, setInboxUsers] = useState([]);

  console.log(inboxUsers)

  const peerConfig = {
    iceServers: [
      {
        urls: "stun:stun.l.google.com:19302",
      },
    ],
  };

  if (user?.user?.role === "interviewer") {
    userRef.current = true;

  }

  // ================= START CAMERA =================

  const startCamera = async () => {
    try {
      const stream =
        await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

      localStreamRef.current = stream;

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.log(err);
    }
  };

  // ================= CREATE PEER =================

  const handleChange = (value) => {
  setCode(value);

  socket.emit("code-change", {
    roomId,
    code: value
  });
};

useEffect(() => {
  socket.on("code-update", (newCode) => {
    setCode(newCode);
  });

  return () => {
    socket.off("code-update");
  };
}, []);

  const createPeerConnection = () => {
    const peerConnection =
      new RTCPeerConnection(peerConfig);

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice_candidate", {
          roomId,
          candidate: event.candidate,
        });
      }
    };

    peerConnection.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject =
          event.streams[0];
      }
    };

    localStreamRef.current
      ?.getTracks()
      .forEach((track) => {
        peerConnection.addTrack(
          track,
          localStreamRef.current
        );
      });

    peerConnectionRef.current = peerConnection;

    return peerConnection;
  };

  // ================= FETCH INBOX USERS =================

  const handleSend = async () => {
    try {
      const response = await fetch(
        "https://interviewos.online/api/interviewer-inbox-users",
        {
          method: "GET",
          credentials: "include",
        }
      );

      const res = await response.json();

      if (res.success) {
        setInboxUsers(res.users);

        setOpenInbox(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // ================= SEND ROOM ID =================

  const interviewLink = `https://interviewos.online/call/${roomId}`;

  const handleSendRoomId = async (receiverId) => {

    const message = `
  You are invited to an interview.

  Room ID: ${roomId}

  Join Here:
  ${interviewLink}
  `;

    await fetch("https://interviewos.online/api/save-message", {
      method: "POST",

      credentials: "include",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        receiverId,
        text: message,
      }),
    });

    socket.emit("send_message", {
      receiverId,
      text: message,
    });

    setOpenInbox(false);

  }

  // ================= SOCKET EVENTS =================

  useEffect(() => {
    const init = async () => {
      await startCamera();

      socket.emit("join_video_room", {
        roomId,
        username,
      });
    };

    const handleUserJoined = async () => {
      const peerConnection =
        createPeerConnection();

      const offer =
        await peerConnection.createOffer();

      await peerConnection.setLocalDescription(
        offer
      );

      socket.emit("video_offer", {
        roomId,
        offer,
      });
    };

    const handleOffer = async ({ offer }) => {
      const peerConnection =
        createPeerConnection();

      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(offer)
      );

      const answer =
        await peerConnection.createAnswer();

      await peerConnection.setLocalDescription(
        answer
      );

      socket.emit("video_answer", {
        roomId,
        answer,
      });
    };

    const handleAnswer = async ({ answer }) => {
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.setRemoteDescription(
          new RTCSessionDescription(answer)
        );
      }
    };

    const handleIceCandidate = async ({
      candidate,
    }) => {
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.addIceCandidate(
          new RTCIceCandidate(candidate)
        );
      }
    };

    init();

    socket.on(
      "user_joined_video",
      handleUserJoined
    );

    socket.on("video_offer", handleOffer);

    socket.on("video_answer", handleAnswer);

    socket.on(
      "ice_candidate",
      handleIceCandidate
    );

    return () => {
      socket.off(
        "user_joined_video",
        handleUserJoined
      );

      socket.off("video_offer", handleOffer);

      socket.off(
        "video_answer",
        handleAnswer
      );

      socket.off(
        "ice_candidate",
        handleIceCandidate
      );

      socket.emit("leave_video_room", {
        roomId,
      });

      localStreamRef.current
        ?.getTracks()
        .forEach((track) => track.stop());

      peerConnectionRef.current?.close();
    };
  }, [roomId, username]);

  // ================= END CALL =================

  const handleEndCall = () => {
    localStreamRef.current
      ?.getTracks()
      .forEach((track) => track.stop());

    peerConnectionRef.current?.close();

    socket.emit("leave_video_room", {
      roomId,
    });

    navigate("/");
  };

  // ================= TOGGLE MIC =================

  const handleToggleMic = () => {
    const audioTrack =
      localStreamRef.current
        ?.getTracks()
        .find(
          (track) => track.kind === "audio"
        );

    if (audioTrack) {
      audioTrack.enabled =
        !audioTrack.enabled;

      setMicOn(audioTrack.enabled);
    }
  };

  // ================= TOGGLE CAMERA =================

  const handleToggleCamera = () => {
    const videoTrack =
      localStreamRef.current
        ?.getTracks()
        .find(
          (track) => track.kind === "video"
        );

    if (videoTrack) {
      videoTrack.enabled =
        !videoTrack.enabled;

      setCameraOn(videoTrack.enabled);
    }
  };

  return (
    <Box
  sx={{
    flex: 1,
    display: "grid",
    gridTemplateColumns: {
      xs: "1fr",
      lg: "1fr 1fr",
    },
    gap: "20px",
    padding: "20px",
    overflow: "hidden",
  }}
>
  {/* LEFT SIDE */}
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      gap: "20px",
    }}
  >
    {/* Local Video */}
    <Box
      sx={{
        flex: 1,
        minHeight: "250px",
        position: "relative",
        border: "2px solid white",
        borderRadius: "16px",
        overflow: "hidden",
      }}
    >
      <video
        ref={localVideoRef}
        autoPlay
        muted
        playsInline
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          background: "black",
        }}
      />

      <Typography
        sx={{
          position: "absolute",
          bottom: 10,
          left: 10,
          color: "white",
          background: "rgba(0,0,0,0.6)",
          px: 1,
          py: 0.5,
          borderRadius: 2,
        }}
      >
        You
      </Typography>
    </Box>

    {/* Remote Video */}
    <Box
      sx={{
        flex: 1,
        minHeight: "250px",
        position: "relative",
        border: "2px solid white",
        borderRadius: "16px",
        overflow: "hidden",
      }}
    >
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          background: "black",
        }}
      />

      <Typography
        sx={{
          position: "absolute",
          bottom: 10,
          left: 10,
          color: "white",
          background: "rgba(0,0,0,0.6)",
          px: 1,
          py: 0.5,
          borderRadius: 2,
        }}
      >
        Candidate
      </Typography>
    </Box>
  </Box>

  {/* RIGHT SIDE CODE EDITOR */}
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      borderRadius: "16px",
      overflow: "hidden",
      border: "1px solid #374151",
      background: "#111827",
    }}
  >
    {/* Editor Header */}
    <Box
      sx={{
        p: 2,
        background: "#1f2937",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Typography color="white">
        Coding Round
      </Typography>

      <Button
        variant="contained"
        color="success"
      >
        Run Code
      </Button>
    </Box>

    {/* Monaco Editor */}
    <Editor
     height="100%"
     defaultLanguage="javascript"
    value={code}
    onChange={handleChange}
    theme="vs-dark"
    />
  </Box>
</Box>
  )
}
