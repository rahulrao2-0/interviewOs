import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useLocation, useNavigate, useParams } from "react-router-dom";

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
        height: "100vh",
        width: "100%",
        backgroundColor: "#111827",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* HEADER */}

      <Box
        sx={{
          padding: "15px 25px",
          backgroundColor: "#1f2937",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <Box>
          <Typography
            variant="h5"
            fontWeight="bold"
          >
            Video Interview
          </Typography>

          <Typography fontSize="14px">
            Room ID : {roomId}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
          }}
        >
          <Typography fontSize="16px">
            Username : {username}
          </Typography>

          {userRef.current && (
            <Button
              variant="contained"
              onClick={handleSend}
            >
              Send Room ID
            </Button>
          )}
        </Box>
      </Box>

      {/* VIDEO SECTION */}

      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: {
            xs: "column",
            md: "row",
          },
          gap: "20px",
          padding: "20px",
        }}
      >
        {/* LOCAL VIDEO */}

        <Box
          sx={{
            flex: 1,
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
              backgroundColor: "black",
            }}
          />

          <Typography
            sx={{
              position: "absolute",
              bottom: "15px",
              left: "15px",
              backgroundColor:
                "rgba(0,0,0,0.6)",
              color: "white",
              padding: "6px 14px",
              borderRadius: "20px",
            }}
          >
            You
          </Typography>
        </Box>

        {/* REMOTE VIDEO */}

        <Box
          sx={{
            flex: 1,
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
              backgroundColor: "black",
            }}
          />

          <Typography
            sx={{
              position: "absolute",
              bottom: "15px",
              left: "15px",
              backgroundColor:
                "rgba(0,0,0,0.6)",
              color: "white",
              padding: "6px 14px",
              borderRadius: "20px",
            }}
          >
            Candidate
          </Typography>
        </Box>
      </Box>

      {/* CONTROLS */}

      <Box
        sx={{
          padding: "20px",
          backgroundColor: "#1f2937",
          display: "flex",
          justifyContent: "center",
          gap: "20px",
        }}
      >
        <IconButton
          onClick={handleToggleMic}
          sx={{
            backgroundColor: "white",
          }}
        >
          {micOn ? <Mic /> : <MicOff />}
        </IconButton>

        <IconButton
          onClick={handleToggleCamera}
          sx={{
            backgroundColor: "white",
          }}
        >
          {cameraOn ? (
            <Videocam />
          ) : (
            <VideocamOff />
          )}
        </IconButton>

        <Button
          variant="contained"
          color="error"
          startIcon={<CallEnd />}
          onClick={handleEndCall}
          sx={{
            borderRadius: "20px",
            paddingX: "20px",
          }}
        >
          End Call
        </Button>
      </Box>

      {/* INBOX DIALOG */}

      <Dialog
        open={openInbox}
        onClose={() =>
          setOpenInbox(false)
        }
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          Select Candidate
        </DialogTitle>

        <DialogContent>
          <List>
            {inboxUsers?.map((user) => (
              <ListItem
                key={user.user_id}
                secondaryAction={
                  <Button
                    variant="contained"
                    onClick={() =>
                      handleSendRoomId(
                        user.user_id
                      )
                    }
                  >
                    Send
                  </Button>
                }
              >
                <ListItemText
                  primary={user.username}
                  secondary={user.email}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
