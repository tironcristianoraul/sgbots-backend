import express from "express";

const guestRouter = express.Router();

import Newsletter from "../database/models/Newsletter";

// Ruta POST pentru abonare la newsletter
guestRouter.post("/subscribe", async (req, res) => {
  try {
    const { email, name } = req.body;

    // Verificăm dacă email-ul a fost trimis
    if (!email) {
      return res.status(400).json({ message: "Email-ul este necesar." });
    }

    // Creăm o nouă intrare în baza de date
    const newSubscriber = new Newsletter({
      email,
      name,
    });

    await newSubscriber.save();

    res.status(201).json({
      message: "Te-ai abonat cu succes la newsletter!",
      subscriber: newSubscriber,
    });
  } catch (error: any) {
    // Tratăm eroarea de email duplicat (Codul 11000 în MongoDB)
    if (error.code === 11000) {
      return res.status(409).json({ message: "Acest email este deja abonat." });
    }

    res.status(500).json({
      message: "A apărut o eroare la server.",
      error: error.message,
    });
  }
});

export default guestRouter;
