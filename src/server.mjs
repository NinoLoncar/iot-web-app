import express from "express";
import dotenv from "dotenv/config";

const server = express();

const port = process.env.PORT || 3000;

server.get("/", (req, res) => {
	res.send("Hello world");
});

server.listen(port, async () => {
	console.log(`Server pokrenut na portu: ${port}`);
});
