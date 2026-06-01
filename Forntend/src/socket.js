import { io } from "socket.io-client";


const socket = io("http://ec2-13-126-64-8.ap-south-1.compute.amazonaws.com:5000", {
    withCredentials: true
});

export default socket;