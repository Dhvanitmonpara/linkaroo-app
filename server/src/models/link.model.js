import mongoose, { Schema } from "mongoose";

const linkSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    image: { type: String, default: null },
    link: { type: String, required: true, unique: true }
}, { timestamps: true });

export const Link = mongoose.model("Link", linkSchema)

const userLinkSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    collectionId: { type: Schema.Types.ObjectId, ref: "Collection", required: true },
    linkId: { type: Schema.Types.ObjectId, ref: "Link", required: true },

    // Custom user-specific overrides
    customTitle: { type: String, default: null }, 
    customDescription: { type: String, default: null },
    isChecked: { type: Boolean, default: false }
}, { timestamps: true });

export const UserLink = mongoose.model("UserLink", userLinkSchema);