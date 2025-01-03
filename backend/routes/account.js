const {Router} = require('express');
const userAuthMiddleware = require('../middlewares/userMiddleware');
const { Account, User } = require('../db');
const zod = require('zod');
const mongoose = require('mongoose');

const router = Router();

const transferSchema = zod.object({
    to: zod.string().min(1),
    amount: zod.number().positive("Amount must be a positive number") 
});


router.get("/balance", userAuthMiddleware ,async function(req,res){
    const userId = req.userId;

    const account = await Account.findOne({userId})

    res.json({balance : account.balance});
});

router.post("/transfer", userAuthMiddleware , async function (req, res) {
    console.log("hi")
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { to, amount } = req.body;
        const userId = req.userId;

        // Validate inputs
        const response = transferSchema.safeParse({ to, amount });
        if (!response.success) {
            throw new Error("Invalid recipient/amount");
        }

        // Fetch sender's account
        const account = await Account.findOne({ userId }).session(session);
        if (!account || account.balance < amount) {
            throw new Error("Insufficient balance");
        }

        // Fetch recipient's account
        const toAccount = await Account.findOne({ userId: to }).session(session);
        if (!toAccount) {
            throw new Error("Invalid recipient account");
        }

        // Debit the sender's account
        account.balance -= amount;
        await account.save({ session });

        // Credit the recipient's account
        toAccount.balance += amount;
        await toAccount.save({ session });

        // Commit the transaction
        await session.commitTransaction();
        session.endSession();

        return res.json({ message: "Transfer Successful" });
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ message: err.message });
    }
});

module.exports = router;