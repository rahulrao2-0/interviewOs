import jwt from "jsonwebtoken";

export const createToken = (user)=>{
  console.log("userid in jwt",user.id)
        return jwt.sign(
            { id: user.id, role: user.role ,},  // Payload: user ID + role
            process.env.JWT_SECRET,             // Secret key from .env
            { expiresIn: "1d" } 
        )
}

export const verfiyToken = (token) =>{
    try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null; // Token invalid or expired
  }
}