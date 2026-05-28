import { useEffect, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { Box, Button, Typography } from "@mui/material";

const socket = io("http://localhost:5000", {
  withCredentials: true,
});

export default function VideoCall() {
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const username = location.state?.username || "Guest";

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const peerConnectionRef = useRef(null);

  const peerConfig = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    localStreamRef.current = stream;

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }
  };

  const createPeerConnection = () => {
    const peerConnection = new RTCPeerConnection(peerConfig);

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice_candidate", {
          roomId,
          candidate: event.candidate,
        });
      }
    };

    peerConnection.ontrack = (event) => {
      console.log("Remote stream received:", event.streams[0]);

      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    localStreamRef.current.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStreamRef.current);
    });

    peerConnectionRef.current = peerConnection;

    return peerConnection;
  };

  useEffect(() => {
    const init = async () => {
      await startCamera();

      socket.emit("join_video_room", {
        roomId,
        username,
      });
    };

    const handleUserJoined = async () => {
      const peerConnection = createPeerConnection();

      const offer = await peerConnection.createOffer();

      await peerConnection.setLocalDescription(offer);

      socket.emit("video_offer", {
        roomId,
        offer,
      });
    };

    const handleOffer = async ({ offer }) => {
      const peerConnection = createPeerConnection();

      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(offer)
      );

      const answer = await peerConnection.createAnswer();

      await peerConnection.setLocalDescription(answer);

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

    const handleIceCandidate = async ({ candidate }) => {
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.addIceCandidate(
          new RTCIceCandidate(candidate)
        );
      }
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

      localStreamRef.current?.getTracks().forEach((track) => track.stop());
      peerConnectionRef.current?.close();
    };
  }, [roomId, username]);

  const handleEndCall = () => {
    localStreamRef.current?.getTracks().forEach((track) => track.stop());
    peerConnectionRef.current?.close();

    socket.emit("leave_video_room", { roomId });

    navigate("/");
  };

  return (
    <Box sx={{ padding: "30px" }}>
      <Typography variant="h4">Interview Video Call</Typography>

      <Typography sx={{ marginTop: "10px" }}>
        Username: {username}
      </Typography>

      <Typography>Room ID: {roomId}</Typography>

      <Box sx={{ display: "flex", gap: "20px", marginTop: "30px" }}>
        <Box>
          <Typography variant="h6">My Video</Typography>
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            style={{
              width: "400px",
              height: "280px",
              backgroundColor: "black",
              borderRadius: "10px",
            }}
          />
        </Box>

        <Box>
          <Typography variant="h6">Remote Video</Typography>
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            style={{
              width: "400px",
              height: "280px",
              backgroundColor: "black",
              borderRadius: "10px",
            }}
          />
        </Box>
      </Box>

      <Button
        variant="contained"
        color="error"
        sx={{ marginTop: "30px" }}
        onClick={handleEndCall}
      >
        End Call
      </Button>
    </Box>
  );
}