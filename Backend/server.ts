import dotenv from 'dotenv';
dotenv.config();
import app from "./src/app.js";
import connectDB from "./src/config/database.js";

connectDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});