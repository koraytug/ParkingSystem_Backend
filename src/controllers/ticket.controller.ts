import { ITicketController } from "./iticket.controller";
import { Request, Response } from "express";
import { ITicket } from "../models/iticket";
import TicketService from "../services/ticket.service";
import { ITicketService } from "../services/iticket.service";
import { ITicketCalculation } from "../models/iticket-calculation";

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

            const aaa = (Math.floor(Math
                .random() * (maxm - minm + 1)) + minm).toString();
            // const barcode: string = "_" + Math.random().toString(36).substr(2, 9);
            const barcode: string = aaa;
            console.log("barcode", barcode);

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

    public async getCalculatedPrice(req: Request, res: Response): Promise<ITicket> {
        try {
            const ticketService: ITicketService = new TicketService();

            if (!req.query || !req.query.barcode) {
                res.status(400).send({ message: "Content can not be empty!" });
                return Promise.reject("Content can not be empty!");
            }

            const tickets: ITicket[] = await ticketService.getTicket(req.query.barcode.toString());
            if (!tickets || tickets.length === 0) {
                res.status(404).json("There is no ticket!");
            }

            const entranceDate: Date = new Date(tickets[0].entranceDate)
            const exitDate: Date = new Date();


            let diffMs = (entranceDate.valueOf() - exitDate.valueOf()); // milliseconds
            let diffDays = Math.abs(Math.floor(diffMs / 86400000)); // days
            let diffHrs = Math.abs(Math.floor((diffMs % 86400000) / 3600000)); // hours
            let diffMins = Math.abs(Math.round(((diffMs % 86400000) % 3600000) / 60000)); // minutes

            let calculatedPrice: number = 0;

            if (diffDays > 0) {
                calculatedPrice += diffDays * 24;
            }

            if (diffHrs > 0) {
                calculatedPrice += diffHrs;
            }

            if (diffMins > 15) {
                calculatedPrice += 1;
            }


            // difference in milliseconds and 36e5 => 60*60*1000
            // var hours = Math.abs(entranceDate.valueOf() - exitDate.valueOf()) / 36e5;


            const ticketCalculation: ITicketCalculation = {
                entranceDate: tickets[0].entranceDate,
                ticketBarcode: tickets[0].ticketBarcode,
                calculationTime: exitDate.toLocaleString(),
                price: calculatedPrice * 2,
            }

            res.status(200);
            res.send(ticketCalculation);
            return Promise.resolve(ticketCalculation);
        } catch (error) {
            res.status(500).json({ error: error });
            return Promise.reject(error);
        }
    }
}

