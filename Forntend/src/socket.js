import { io } from "socket.io-client";


const socket = io("https://interviewos.online", {
    withCredentials: true
});

export default socket;
