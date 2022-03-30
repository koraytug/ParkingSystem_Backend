import { MongoClient, ObjectId } from "mongodb";
import { ITicket } from "../models/iticket";
import { ITicketService } from "./iticket.service";

export default class TicketService implements ITicketService {
    private uri: string = process.env.uri || "";
    private dbName = "PARKING";
    private collectionName = "tickets";

    public async createTicket(customer: ITicket) {
        try {
            const client = await new MongoClient(this.uri);
            await client.connect();
            const db = client.db(this.dbName);
            const addedItem = await db.collection("tickets").insertOne(customer);
            const insertedId = (await addedItem).insertedId.toString();
            await client.close();
            return insertedId;
        } catch (error) {
            console.log(`Could not add ticket ${error}`);
            throw error;
        }

    }

    public async getTicket(barcode: string) {
        try {
            const client = await new MongoClient(this.uri);

            await client.connect();

            const db = client.db(this.dbName);
            const items = db.collection(this.collectionName).find({ ticketBarcode: barcode });
            const result = await items.toArray();

            await client.close();
            return result;
        } catch (error) {
            console.log(`Could not fetch customer ${error}`);
            throw error;
        }
    }

    public async updateTicket(ticket: ITicket) {
        try {
            const client = await new MongoClient(this.uri);
            await client.connect();
            const db = client.db(this.dbName);

            // upsert creates new record when it can not find the record
            const updatedItem = await db.collection(this.collectionName)
                .findOneAndUpdate({ ticketBarcode: ticket.ticketBarcode }, {
                    $set:
                    {
                        entranceDate: ticket.entranceDate,
                        ticketBarcode: ticket.ticketBarcode,
                        calculationTime: ticket.calculationTime,
                        calculatedPrice: ticket.calculatedPrice,
                    }
                }, { upsert: true });

            const updateStatus = (updatedItem.ok === 1) ? true : false;
            await client.close();
            return updateStatus;
        } catch (error) {
            console.log(`Could not update the ticket ${error}`);
            throw error;
        }
    }

    public async payTicket(barcode: string, paymentMethod: string) {
        try {
            const client = await new MongoClient(this.uri);
            await client.connect();
            const db = client.db(this.dbName);

            // upsert creates new record when it can not find the record
            const updatedItem = await db.collection(this.collectionName)
                .findOneAndUpdate({ ticketBarcode: barcode }, {
                    $set:
                    {
                        paid: true,
                        ticketBarcode: barcode,
                        paymentTime: new Date().toLocaleString(),
                        paymentMethod: paymentMethod
                    }
                }, { upsert: true });

            const updateStatus = (updatedItem.ok === 1) ? true : false;
            await client.close();
            return updateStatus;
        } catch (error) {
            console.log(`Could not update the ticket ${error}`);
            throw error;
        }
    }



}

