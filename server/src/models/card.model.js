import mongoose, { Schema } from "mongoose";

const cardSchema = new Schema({

    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true,
        unique: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    lisId: {
        type: Schema.Types.ObjectId,
        ref: "List"
    },
    
}, { timestamps: true })

export const Card = mongoose.model("Card", cardSchema)