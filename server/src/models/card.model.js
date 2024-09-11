import mongoose, { Schema } from "mongoose";

const cardSchema = new Schema({

    title: {
        type: String,
        unique: true,
        required: true,
    },
    description: {
        type: String,
    },
    link: {
        type: String,
        required: true,
    },
    isChecked: {
        type: Boolean,
        default: false
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    listId: {
        type: Schema.Types.ObjectId,
        ref: "List",
        required: true
    },
    
}, { timestamps: true })

export const Card = mongoose.model("Card", cardSchema)