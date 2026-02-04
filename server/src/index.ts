import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
//import compression from "compression";

//init middleware

//init db

//handling error

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(morgan("common"));

app.use(cors());

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
