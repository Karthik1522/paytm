const mongoose = require('mongoose');
const bcrypt = require("bcrypt");

mongoose.connect('mongodb+srv://DBADMIN:RhZs7WYMCKgnKgxe@cluster0.rmvok.mongodb.net/Paytm');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minLength: 3,
        maxLength: 30
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    }
});

UserSchema.methods.createHash = async function (plainTextPassword) {
    // Hashing user's salt and password with 10 iterations,
    const saltRounds = 10;
    return await bcrypt.hash(plainTextPassword, saltRounds);
};

UserSchema.methods.validatePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const AccountSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'Users'
    },
    balance : {
        type : Number,
        required : true
    }
})
 
const User = mongoose.model('Users', UserSchema);
const Account = mongoose.model('Accounts', AccountSchema);

module.exports = {User, Account}; 