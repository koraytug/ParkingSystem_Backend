import { ITicket } from "../models/iticket";

export interface ITicketService {
    createTicket(ticket: ITicket);
}
