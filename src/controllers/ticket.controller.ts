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

            const randomNumber = (Math.floor(Math
                .random() * (maxm - minm + 1)) + minm).toString();

            const barcode: string = randomNumber;
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

            if (tickets[0].paid && tickets[0].paid === true) {
                const ticketCalculation: ITicketCalculation = {
                    entranceDate: tickets[0].entranceDate,
                    ticketBarcode: tickets[0].ticketBarcode,
                    calculationTime: tickets[0].calculationTime,
                    price: 0,
                }
                res.status(200);
                res.send(ticketCalculation);
                return Promise.resolve(ticketCalculation);
            }

            const entranceDate: Date = new Date(tickets[0].entranceDate)
            const exitDate: Date = new Date();

            const diffMs = (exitDate.valueOf() - entranceDate.valueOf()); // milliseconds
            const diffDays = Math.abs(Math.floor(diffMs / 86400000)); // days
            const diffHrs = Math.abs(Math.floor((diffMs % 86400000) / 3600000)); // hours
            const diffMins = Math.abs(Math.round(((diffMs % 86400000) % 3600000) / 60000)); // minutes

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

            const ticketCalculation: ITicketCalculation = {
                entranceDate: tickets[0].entranceDate,
                ticketBarcode: tickets[0].ticketBarcode,
                calculationTime: exitDate.toLocaleString(),
                price: calculatedPrice * 2,
            }

            const ticketToUpdate: ITicket = tickets[0];
            ticketToUpdate.calculatedPrice = ticketCalculation.price;
            ticketToUpdate.calculationTime = ticketCalculation.calculationTime;

            const customerUpdated = await ticketService.updateTicket(ticketToUpdate);

            if (!customerUpdated) {
                return Promise.reject("Ticket could not updated");
            }

            res.status(200);
            res.send(ticketCalculation);
            return Promise.resolve(ticketCalculation);
        } catch (error) {
            res.status(500).json({ error: error });
            return Promise.reject(error);
        }
    }


    public async findTicket(req: Request, res: Response): Promise<ITicket> {
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
            console.log("ticket ", tickets[0]);

            res.status(200);
            res.send(tickets[0]);
            return Promise.resolve(tickets[0]);
        } catch (error) {
            res.status(500).json({ error: error });
            return Promise.reject(error);
        }
    }

    public async payTicket(req: Request, res: Response): Promise<boolean> {
        try {
            const ticketService: ITicketService = new TicketService();

            if (!req.query || !req.query.barcode || !req.query.paymentmethod) {
                res.status(400).send({ message: "Content can not be empty!" });
                return Promise.reject("Content can not be empty!");
            }

            const updateStatus = await ticketService.payTicket(req.query.barcode.toString(), req.query.paymentmethod.toString());
            if (!updateStatus || updateStatus === false) {
                res.status(404).json("Ticket could not set paid!");
            }

            res.status(200);
            res.send(true);
            return Promise.resolve(true);
        } catch (error) {
            res.status(500).json({ error: error });
            return Promise.reject(error);
        }
    }
}

