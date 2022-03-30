import { ITicketController } from "./iticket.controller";
import { Request, Response } from "express";
import { ITicket } from "../models/iticket";
import TicketService from "../services/ticket.service";
import { ITicketService } from "../services/iticket.service";
import { ITicketCalculation } from "../models/iticket-calculation";
import TicketHelper from "../helpers/ticket-helper";
import { ITicketHelper } from "../helpers/iticket-helper";

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

            if (!ticketId) {
                res.status(204).json("There is an error while getting the customerID!");
                return Promise.resolve(ticketId);
            }


            console.log("Generated Barcode: ", barcode);
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
            const ticketHelper: ITicketHelper = new TicketHelper();

            if (!req.query || !req.query.barcode) {
                res.status(400).send({ message: "Content can not be empty!" });
                return Promise.reject("Content can not be empty!");
            }

            const tickets: ITicket[] = await ticketService.getTicket(req.query.barcode.toString());
            if (!tickets || tickets.length === 0) {
                res.status(404).json("There is no ticket!");
            }

            if (tickets[0].paid && tickets[0].paid === true) {
                const timeDiff: number = ticketHelper.calculatedPrice(new Date(tickets[0].entranceDate), new Date())
                let priceDiff: number = 0;

                if (timeDiff > 0) {
                    priceDiff = timeDiff * 2;
                }
                const ticketCalculation: ITicketCalculation = {
                    entranceDate: tickets[0].entranceDate,
                    ticketBarcode: tickets[0].ticketBarcode,
                    calculationTime: tickets[0].calculationTime,
                    price: priceDiff,
                }

                console.log("Price is: ", priceDiff);

                res.status(200);
                res.send(ticketCalculation);
                return Promise.resolve(ticketCalculation);
            }

            const entranceDate: Date = new Date(tickets[0].entranceDate)
            const exitDate: Date = new Date();

            const calculatedPrice: number = ticketHelper.calculatedPrice(entranceDate, exitDate);

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

            console.log("Price is: ", ticketCalculation.price);

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

            console.log("Ticket paid succesfully!")
            res.status(200);
            res.send(true);
            return Promise.resolve(true);
        } catch (error) {
            res.status(500).json({ error: error });
            return Promise.reject(error);
        }
    }

    public async getTicketState(req: Request, res: Response): Promise<string> {
        try {
            const ticketService: ITicketService = new TicketService();
            const ticketHelper = new TicketHelper();

            if (!req.query || !req.query.barcode) {
                res.status(400).send({ message: "Content can not be empty!" });
                return Promise.reject("Content can not be empty!");
            }

            const tickets: ITicket[] = await ticketService.getTicket(req.query.barcode.toString());
            if (!tickets || tickets.length === 0) {
                res.status(404).json("There is no ticket!");
            }

            if (tickets[0].paid === false) {
                console.log("Ticket is unPaid!")

                res.status(200);
                res.send(JSON.stringify("unPaid"));
                return Promise.resolve(JSON.stringify("unPaid"));
            }

            if (tickets[0].paid && tickets[0].paid === true) {

                const timeDiff: number = ticketHelper.calculatedPrice(new Date(tickets[0].paymentTime), new Date())

                let result: string = "paid"


                if (timeDiff > 0) {
                    result = "unPaid"
                }

                console.log(`Ticket is ${result}!`)

                res.status(200);
                res.send(JSON.stringify(result));
                return Promise.resolve(JSON.stringify(result));
            }

            console.log("Ticket is paid!")
            res.status(200);
            res.send(JSON.stringify("paid"));
            return Promise.resolve(JSON.stringify("paid"));
        } catch (error) {
            res.status(500).json({ error: error });
            return Promise.reject(error);
        }
    }

    public async setDoorExit(req: Request, res: Response): Promise<boolean> {
        try {
            const ticketService: ITicketService = new TicketService();

            if (!req.query || !req.query.barcode) {
                res.status(400).send({ message: "Content can not be empty!" });
                return Promise.reject("Content can not be empty!");
            }

            const updateStatus = await ticketService.setDoorExit(req.query.barcode.toString());
            if (!updateStatus || updateStatus === false) {
                res.status(404).json("Exit could not set!");
            }

            console.log("Exit succesfully!")
            res.status(200);
            res.send(true);
            return Promise.resolve(true);
        } catch (error) {
            res.status(500).json({ error: error });
            return Promise.reject(error);
        }
    }

    public async getFreeSpace(req: Request, res: Response): Promise<string> {
        try {
            const ticketService: ITicketService = new TicketService();

            const tickets: ITicket[] = await ticketService.getFreeSpace();

            if (!tickets || tickets.length === 0) {
                res.status(200);
                res.send(JSON.stringify("54"));
            }

            const freeSpace = 54 - tickets.length;

            console.log(`There are ${freeSpace} free spaces!`)
            res.status(200);
            res.send(JSON.stringify(freeSpace.toString()));
            return Promise.resolve(JSON.stringify(freeSpace.toString()));
        } catch (error) {
            res.status(500).json({ error: error });
            return Promise.reject(error);
        }
    }
}

