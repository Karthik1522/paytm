const express = require("express");
const userRouter = require('./routes/user');
const bodyParser = require('body-parser');
const cors = require('cors');
const accountRouter = require('./routes/account')
const jwt = require('jsonwebtoken');
const JWT_SECRET = require('./config')


const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use((req, res, next) => {
    console.log(`Received ${req.method} request for ${req.url}`);
    next();
});

app.get("/me", (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Token not provided or invalid" });
    }

    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        
        return res.json({ userId: decoded.userId , name : decoded.name });
    } catch (err) {
        console.error("JWT Verification Error:", err.message);
        return res.status(401).json({ message: "Not Authorized" });
    }
});


app.use("/user",userRouter);
app.use("/account",accountRouter);

app.listen(3000,()=>{
    console.log("Server listening on PORT 3000");
});
