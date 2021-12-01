export interface SetInterface {
   _id: string;
   title: string;
   description: string;
   tags: string[];
   cards: { _id: string; term: string; definition: string }[];
}
