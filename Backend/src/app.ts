import express from "express"
import useGraph from "./services/graph.ai.service.js"

const app = express()


app.get('/' , (req , res)=> {
    res.status(200).json({
        message: "okay"
    })
})

app.post("/use-graph", async (req, res) => {
    const result = await useGraph("what is capital of nepal");

    res.json({
        result
    });
});
export default app
