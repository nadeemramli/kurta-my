export type Product = {
  id: string;
  name: string;
  description?: string;
  price: {
    amount: number;
    currencyCode: string;
  };
  images: {
    url: string;
    altText: string;
    width: number;
    height: number;
  }[];
};

export type SortFilterItem = {
  title: string;
  slug: string;
  sortKey: 'RELEVANCE' | 'BEST_SELLING' | 'CREATED_AT' | 'PRICE';
  reverse?: boolean;
}; 