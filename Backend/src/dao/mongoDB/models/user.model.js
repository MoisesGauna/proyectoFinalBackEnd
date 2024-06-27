import mongoose from 'mongoose';

const userCollection = 'user';

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    password: {type: String},
    name: {type: String},
    lastname: {type: String},
    tel: {type: String},
    admin: {type: Boolean, default: false},
    rol:{
        type: String, 
        enum: ['admin', 'user', 'premium'], 
        default: 'user' 
    },
    cartId:{type: mongoose.Types.ObjectId,ref: "carts"},
    resetPasswordToken:{type: String},
    resetPasswordExpires: {type: Date},
    documents: [
        {
            name: {type: String},
            reference: {type: String}
        }
    ],
    last_connection: {type: String}
},
{
    timestamps: true,
    strict:false
}
);

userSchema.pre('find', function(next){
    this.populate('carts._id');
    next();
});

export const userModel = mongoose.model('User', userSchema, userCollection);
