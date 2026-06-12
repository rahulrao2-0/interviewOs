import { io } from "socket.io-client";


const socket = io("http://interviewos.online", {
    withCredentials: true
});

export default socket;
