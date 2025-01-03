const {Router} = require('express');
const zod = require('zod');
const {User, Account} = require('../db');
const jwt = require('jsonwebtoken');
const JWT_SECRET = require('../config');
const router = Router();
const userAuthMiddleware = require('../middlewares/userMiddleware')


const UserInput = zod.object({
    username : zod.string().email({ message: "Invalid email format" }),
    firstName : zod.string().optional(),
    lastName : zod.string().optional(),
    password : zod.string().min(6,{message : "Please Enter Password which is 6 in length"})
                .refine(
                (password) => /[A-Z]/.test(password),
                { message: "Password must contain at least one uppercase letter." }
            )
            .refine(
                (password) => /[0-9]/.test(password),
                {message: "Password must contain at least one Digit."}
            )
            .refine(
                (password) => /[!@#$%^&*(),.?":{}|<>]/.test(password),
                {message : "Password must contain at least one special character."}
            )
});


const updateBody = zod.object({
    password : zod.string().optional(),
    firstname : zod.string().optional(),
    lastname : zod.string().optional()
})


router.post('/signUp', async function(req, res) {
    const { username, firstName, lastName, password } = req.body;

    const response = UserInput.safeParse({ username, firstName, lastName, password });

    if (!response.success) {
        return res.status(411).json({ message: "Incorrect inputs", errors: response.error.errors });
    }

    try {
        const exisitinguser = await User.findOne({ username });

        if (exisitinguser) {
            return res.status(411).json({ message: "Email already Taken" });
        }

        const hashedPassword = await new User().createHash(password);

        const user = await User.create({
            username,
            password: hashedPassword,
            firstName,
            lastName
        });

        const userId = user._id;
        const firstname = firstName;

        await Account.create({
            userId,
            balance : 1 + Math.floor(Math.random()*10000)
        })

        const userToken = jwt.sign({ userId: user._id, name : firstname }, JWT_SECRET);

        return res.json({ message: "User Created" , token : userToken});
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "User with this username already exists" , er : error.message });
        }
        console.error(`Error: ${error.message}`);
        return res.status(500).json({ message: "Error creating user" });
    }
});


router.post('/signIn' , async function(req,res){
    const { username, password } = req.body;

    const response = UserInput.safeParse({username, password});

    if(!response.success){
        return res.status(411).json({message : "Incorrect inputs"})
    }

    const user = await User.findOne({username});
    if(user){

        if(await user.validatePassword(password)){
            const token = jwt.sign({
                userId: user._id,
                name : user.firstName
            }, JWT_SECRET);
            
            return res.json({message : "Signed In Successfully" , token : token});
        }

        else return res.status(411).json({ message: "Incorrect email or password" });
    }else{
        res.status(411).json({ message: "Incorrect email or password" });
    }

});

router.put('/update', userAuthMiddleware  , function(req,res){ 
    
    const { userId } = req;
    
    const { firstName,lastName,password } = req.body;
    const {success} = updateBody.safeParse(req.body);

    if(!success){
        res.status(411).json({message : "Error while Updating the info"})
    }


    User.findOneAndUpdate(
        { _id : userId }, // Query to find the user
        {
            $set: {
                firstName: firstName, 
                lastName: lastName,   
                password: password    
            }
        },
        { new: true } // Return the updated document
    )
    .select('-password')
    .select('-_id')
    .then(function(updatedUser){
        if (updatedUser) {
            return res.json({ message: "Updated User Info", user: updatedUser });
        } else {
            return res.status(404).json({ message: "User not found" });
        }
    })
    .catch(function(e){
        console.log(e);
        return res.status(500).send("Error");
    })
})


router.get("/bulk", async function(req,res){
    const filter = req.query.filter;

    const regex = new RegExp(filter, "i");
    const users = await User.find({
        $or : [{firstName : regex} , {lastName : regex}]
    })

    return res.json({users : users.map(function(e){
            return {username : e.username , firstName : e.firstName , lastName : e.lastName , userId : e._id}
        })
    
    })
});

//for testing
router.post("/bulkSign",async function(req,res){
    const {users} = req.body;

    for(let i=0;i<users.length;i++){
        const { username, firstName, lastName, password } = users[i];
        const response = UserInput.safeParse({ username, firstName, lastName, password });

        if (!response.success) {
            return res.status(411).json({ message: "Incorrect inputs", errors: response.error.errors });
        }

        try {
            const exisitinguser = await User.findOne({ username });
    
            if (exisitinguser) {
                continue;
            }
    
            const hashedPassword = await new User().createHash(password);
    
            const user = await User.create({
                username,
                password: hashedPassword,
                firstName,
                lastName
            });
    
            const userId = user._id;
            const firstname = firstName;
    
            await Account.create({
                userId,
                balance : 1 + Math.floor(Math.random()*10000)
            })
    
            const userToken = jwt.sign({ userId: user._id, name : firstname }, JWT_SECRET);
    
        } catch (error) {
            if (error.code === 11000) {
                continue;
            }
            console.error(`Error: ${error.message}`);
            continue;
        }
    

    }

    return res.json({message : "Done"})
})
module.exports = router;