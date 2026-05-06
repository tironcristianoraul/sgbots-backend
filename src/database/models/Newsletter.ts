import mongoose from "mongoose";

const newsletterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email-ul este obligatoriu"],
    unique: true, // Nu permite duplicate
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Te rugăm să introduci un email valid"], // Validare simplă regex
  },
  name: {
    type: String,
    trim: true,
    default: "", // Opțional
  },
  subscribedAt: {
    type: Date,
    default: Date.now,
  },
});

const Newsletter = mongoose.model("Newsletter", newsletterSchema);

export default Newsletter;
