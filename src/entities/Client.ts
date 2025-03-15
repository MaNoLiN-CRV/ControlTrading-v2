import Licence from "./Licence";
import Product from "./Product";

export default interface Client {
    idClient: number;
    mt4Id: string; // MT4ID
    name: string; // Client id
    broker: string; // Broker 
    licences: Licence[]; // Licence
    products: Product[]; // Product
}