export interface SetInterface {
   _id: string;
   title: string;
   description: string;
   tags: string[];
   cards: { _id: string; term: string; definition: string }[];
   folder: string[];
   createdAt: string;
   updateddAt: string;
}

export interface FolderInterface {
   _id: string;
   name: string;
   description: string;
   sets: string[];
   createdAt?: string;
   updatedAt?: string;
}
