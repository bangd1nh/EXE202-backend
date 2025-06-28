import express, { json, Router } from "express";
import connectDB from "./src/config/database.js";
import cors from "cors";
import router from "./src/routes/index.js";
import morgan from "morgan";

const app = express();

app.use(json());
app.use(
    cors({
        origin: "*",
    })
);
app.use(morgan("dev"));
app.use('/api', router);

connectDB()
    .then(() => {
        app.listen(3000, () => {
            console.log("server is running on port 3000");
        });
    })
    .catch((error) => {
        console.log("cannot connect to db", error);
    });
