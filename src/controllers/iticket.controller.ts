import { Request, Response } from "express";
import { ITicket } from "../models/iticket";

export interface ITicketController {
    getNewTicket(req: Request, res: Response): Promise<ITicket>;
    getCalculatedPrice(req: Request, res: Response): Promise<ITicket>
}
