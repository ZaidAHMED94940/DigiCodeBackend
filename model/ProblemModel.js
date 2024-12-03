const mongoose=require("mongoose");

const problemSchema=mongoose.Schema({
    ProblemNumber:{
        type:Number,
        required:false
    },
    name:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    input:{
        type:String,
        required:true
    },
    output:{
        type:String,
        required:true
    },
    createdBy:{
        type:String,
        required:false
    },
    difficulty:{
        type:String,
        required:true
    },
    createdAt: { type: Date, default: Date.now },

})

module.exports = mongoose.model('Problem', problemSchema);