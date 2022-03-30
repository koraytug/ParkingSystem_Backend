import { ITicket } from "../models/iticket";

export interface ITicketService {
    createTicket(ticket: ITicket);
    getTicket(barcode: string);
    updateTicket(ticket: ITicket);
    payTicket(barcode: string, paymentMethod: string)
    setDoorExit(barcode: string)
}
