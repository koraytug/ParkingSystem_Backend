import * as express from "express";
import TicketRouter from "./routes/ticket.route";
const bodyParser = require("body-parser");
var cors = require('cors');

if (process.env.NODE_ENV !== "production") require("dotenv").config();

const app = express.default();
app.use(cors());
const PORT = process.env.PORT || 4400;
const appRouter = new TicketRouter();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", appRouter.appRouter);

app.listen(PORT, () => {
    console.log(`listening on port: ${PORT}`);
});
