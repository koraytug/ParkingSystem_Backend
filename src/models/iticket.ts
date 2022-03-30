export interface ITicket {
    ticketBarcode: string;
    entranceDate: string;
    calculationTime?: string,
    calculatedPrice?: number,
    paid?: boolean,
    paymentTime?: string,
    paymentMethod?: string,
    exit?: boolean,
    exitTime?: string
}
