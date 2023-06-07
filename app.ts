import express, { Express } from "express";
import dotenv from "dotenv";
import route from "./routes/route";

dotenv.config();

const app: Express = express();
const port = process.env.APP_PORT;
const name = process.env.APP_NAME;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(route);

app.listen(port, () => {
    console.log(`⚡️[${name}]: Server is running at http://localhost:${port}`);
});
