import * as express from "express";
import TicketController from "../controllers/ticket.controller";
import { ITicketController } from "../controllers/iticket.controller";

export default class TicketRouter {
    public appRouter = express.Router();
    public app: ITicketController = new TicketController();

    constructor() {
        this.appRouter.get("/get_new_ticket", this.app.getNewTicket);
        this.appRouter.get("/get_calculated_price", this.app.getCalculatedPrice);
    }

}

