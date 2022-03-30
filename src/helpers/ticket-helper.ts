import { ITicketHelper } from "./iticket-helper";

export default class TicketHelper implements ITicketHelper {

    public calculatedPrice(entranceDate: Date, exitDate: Date): number {
        try {
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
            return calculatedPrice;
        } catch (error) {
            throw error;
        }
    }
}

