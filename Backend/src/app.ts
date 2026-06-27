import express from "express"
import useGraph from "./services/graph.ai.service.js"
import cors from "cors"

const app = express()
app.use(express.json());
app.use(cors())

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }
  next();
});

app.get('/' , (req , res)=> {
    res.status(200).json({
        message: "okay"
    })
})

app.post("/use-graph", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        error: "message is required",
      });
    }

    const result = await useGraph(message);
    
   
    res.json(result);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
});
export default app