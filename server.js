import express from "express";
import { createServer } from "@mercuryworkshop/scramjet";

const app = express();
const port = process.env.PORT || 8080;

// make a scramjet proxy
const scramjet = await createServer({
  prefix: "/proxy/",
  bare: "/bare/",
});

app.use(scramjet.middleware);

// simple check route
app.get("/", (req, res) => {
  res.send("Luminis Scramjet proxy is running!");
});

app.listen(port, () => console.log(`Proxy running on port ${port}`));
