import * as express from "express";
import TicketController from "../controllers/ticket.controller";
import { ITicketController } from "../controllers/iticket.controller";

export default class TicketRouter {
    public appRouter = express.Router();
    public app: ITicketController = new TicketController();

    constructor() {
        this.appRouter.get("/get_new_ticket", this.app.getNewTicket);
        this.appRouter.get("/get_calculated_price", this.app.getCalculatedPrice);
        this.appRouter.get("/find_ticket", this.app.findTicket);
        this.appRouter.get("/pay_ticket", this.app.payTicket);
        this.appRouter.get("/get_ticket_state", this.app.getTicketState);
        this.appRouter.get("/set_door_exit", this.app.setDoorExit);
        this.appRouter.get("/get_free_spaces", this.app.getFreeSpace);
    }

}

