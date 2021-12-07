export interface SetInterface {
  _id?: string;
  title: string;
  description: string;
  tags: string[];
  cardSet: { term: string; definition: string }[];
}
