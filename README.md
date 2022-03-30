# Parking Lot NodeJs backend example for Platogo

this project has been developed for backend part of Parking Lot codding challenge.

## Installation and Setup Instructions

You will need `node` and `npm` or `yarn` installed globally on your machine.  
To get the project up and running, and view components in the browser, complete the following steps:

1. Download and install Node: <https://nodejs.org/> Also You will need `npm` or `yarn` installed globally on your machine.
2. Clone this repo
3. Install project dependancies: `npm install` or  `yarn install`
4. Start the development environment: `npm run dev` or `yarn dev`

P.S:
`npm install`  or  `yarn install`
Installs all the dependencies listed within package.json in the local node_modules folder.

#### `npm run dev`

## End potints

### get_new_ticket

creates new ticket

```bash
curl http://localhost:4400/get_new_ticket

```

### get_calculated_price

calculates price to pay

```bash
curl -i -X GET -H 'Content-Type: application/json' -d '{"barcode": "2877800767800886"}' http://localhost:4400/get_calculated_price\?barcode\=2877800767800886

```

### find_ticket

finds ticket and retrive ticket informations

```bash
curl -i -X GET -H 'Content-Type: application/json' -d '{"barcode": "2877800767800886"}' http://localhost:4400/find_ticket\?barcode\=2877800767800886

```

### pay_ticket

makes paymet of the ticket

```bash
curl -i -X GET -H 'Content-Type: application/json' -d '{"barcode": "2877800767800886","paymentmethod": "cash"}' http://localhost:4400/find_ticket\?barcode\=2877800767800886
```

### get_ticket_state

retrives status of the ticket

```bash
curl -i -X GET -H 'Content-Type: application/json' -d '{"barcode": "2877800767800886"}' http://localhost:4400/get_ticket_state\?barcode\=2877800767800886

```

### set_door_exit

sets the ticket status exit

```bash
curl -i -X GET -H 'Content-Type: application/json' -d '{"barcode": "2877800767800886"}' http://localhost:4400/set_door_exit\?barcode\=2877800767800886

```

### get_free_spaces

retrives how many free spaces in the parking lot

```bash
curl http://localhost:4400/get_free_spaces

```
