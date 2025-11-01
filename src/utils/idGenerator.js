import { ObjectId } from "bson";

export const generateId = () => {
   const id = new ObjectId().toHexString();
   return id;
};
