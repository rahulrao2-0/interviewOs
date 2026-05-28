import db from "../config/db.js";


export const saveMessage = async (req,res,next)=>{
    console.log("SaveMessage Api hit");
    try{

        const senderId = req.user.id;
        console.log("Request body in saveMessage controller:", req.body);
        const {receiverId , text} = req.body;
        console.log(receiverId,text)
        if(!receiverId || !text){
            return res.status(400).json({ message: "Receiver ID and text are required" });
        }

        const [result] = await db.execute(
            "INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)",
            [senderId, receiverId, text]
        );

        console.log("Message inserted with ID:", result);

        res.status(201).json({ message: "Message saved successfully" });

    }catch(err){
        console.error("Error in saveMessage controller:", err);
        res.status(500).json({ message: "Internal server error" });
    }
}


export const getChatMessages = async(req,res,next)=>{
    console.log("GetChat Messages Ai hit");
    try{
        const myId = req.user.id;
        const otherUserId = req.params.userId;

        const [rows] = await db.execute(
      `SELECT 
         mess_id,
         sender_id AS senderId,
         receiver_id AS receiverId,
         message AS text,
         created_at
       FROM messages
       WHERE 
         (sender_id = ? AND receiver_id = ?)
         OR
         (sender_id = ? AND receiver_id = ?)
       ORDER BY created_at ASC`,
      [myId, otherUserId, otherUserId, myId]
    );

    console.log("Fetched messages:", rows);
    res.status(200).json({ 
        success: true,
        messages: rows });

    }catch(err){
        console.error("Error in getChatMessages controller:", err);
        res.status(500).json({ message: "Internal server error" });

    }
}
  