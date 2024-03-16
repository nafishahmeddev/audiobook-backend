import mongoose from "mongoose";
// ! Users to have id of object IDs.

interface Admin {
    _id: mongoose.ObjectId;
    lastName: string;
    firstName: string;

    age: number;
    country: string;
    sex: "male" | "female";

    password: string;
    email: string;

    emailVerified: boolean;
    totalListenedSeconds: number;

    createdAt: Date;
    updatedAt: Date;

    accessType: string;
}

export const AdminSchema = new mongoose.Schema<Admin>(
    {
        lastName: String,
        firstName: String,

        age: Number,
        country: String,
        sex: { type: String, enum: ["male", "female"] },

        password: String,
        email: { type: String, uppercase: true },

        emailVerified: { type: Boolean, default: false },
        totalListenedSeconds: { type: Number, default: 0 },

        accessType: String
    },
    { timestamps: true }
);

export const Admin = mongoose.model<Admin>("Admin", AdminSchema);
