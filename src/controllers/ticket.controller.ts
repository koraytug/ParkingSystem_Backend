import { ITicketController } from "./iticket.controller";
import { Request, Response } from "express";
import { ITicket } from "../models/iticket";
import TicketService from "../services/ticket.service";
import { ITicketService } from "../services/iticket.service";

export default class TicketController implements ITicketController {

    public async getNewTicket(req: Request, res: Response): Promise<ITicket> {
        try {
            const customerService: ITicketService = new TicketService();

            if (!req.body) {
                res.status(400).send({ message: "Content can not be empty!" });
                return Promise.reject("Content can not be empty!");
            }
            const minm = 1000000000000000;
            const maxm = 9999999999999999;

            const randomNumber = (Math.floor(Math
                .random() * (maxm - minm + 1)) + minm).toString();

            const barcode: string = randomNumber;

            const ticket: ITicket = {
                entranceDate: new Date().toLocaleString(),
                ticketBarcode: barcode
            };

            const ticketId = await customerService.createTicket(ticket);


            console.log("ticket_ID", ticketId);
            if (!ticketId) {
                res.status(204).json("There is an error while getting the customerID!");
                return Promise.resolve(ticketId);
            }


            res.status(200).json({
                status: 'succes',
                data: ticket,
            })
            return Promise.resolve(ticket);

        } catch (error) {
            res.status(500).json({ error: error });
            return error;
        }


    }


}

