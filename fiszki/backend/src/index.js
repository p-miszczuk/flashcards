const express = require("express");
const cors = require("cors");
const groupsRouter = require("./routes/groups");
const cardsRouter = require("./routes/cards");

const app = express();

const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? "https://flashcards-testing.onrender.com"
      : true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/groups", groupsRouter);
app.use("/api/cards", cardsRouter);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
