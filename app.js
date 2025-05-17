import express, { json } from "express";
import connectDB from "./src/config/database.js";
import { loggingMiddleware } from "./src/middleware/index.js";

const app = express();

app.use(json());
app.use(cors());
app.use(loggingMiddleware);

connectDB()
    .then(() => {
        app.listen(3000, () => {
            console.log("server is running on port 3000");
        });
    })
    .catch((error) => {
        console.log("cannot connect to db", error);
    });
