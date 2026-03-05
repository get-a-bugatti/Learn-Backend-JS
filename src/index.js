import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import connectDb from "./db/index.js";

import express from "express";
const app = express();

connectDb()
    .then((connectionInstance) => {
        console.log(
            `MongoDB Connection Succeeded. Host : ${connectionInstance.connection.host}`
        );

        const server = app.listen(process.env.PORT || 8000, () => {
            console.log(`Express Server started at Port : ${process.env.PORT}`);
        });

        server.on("error", (err) => {
            console.error("Server error :", err);
            process.exit(1);
        });
    })
    .catch((err) => {
        console.error("Startup Error :", err);
        process.exit(1);
    });

/*
import express from "express";
const app = express();

(async () => {
    try {
        const connectionInstance = await mongoose.connect(
            `${process.env.MONGODB_URI}/${DB_NAME}`
        );

        console.log(
            `MongoDB Connected : ${connectionInstance.connection.host}`
        );

        const server = app.listen(process.env.PORT, () => {
            console.log(`Server started on port : ${process.env.PORT}`);
        });

        server.on("error", (err) => {
            console.error("Server error :", err);
            process.exit(1);
        });
    } catch (error) {
        console.error("Startup error :", error);
        process.exit(1);
    }
})();

*/
