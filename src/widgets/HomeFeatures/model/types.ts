export type CardData = {
  id: number;
  typeCard: 'big' | 'small';
  titleHighlight?: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
}[];
