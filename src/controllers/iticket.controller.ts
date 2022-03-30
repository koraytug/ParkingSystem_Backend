import { Request, Response } from "express";
import { ITicket } from "../models/iticket";

export interface ITicketController {
    getNewTicket(req: Request, res: Response): Promise<ITicket>;
    getCalculatedPrice(req: Request, res: Response): Promise<ITicket>
    findTicket(req: Request, res: Response): Promise<ITicket>
    payTicket(req: Request, res: Response): Promise<boolean>
    getTicketState(req: Request, res: Response): Promise<string>
    setDoorExit(req: Request, res: Response): Promise<boolean>
}
