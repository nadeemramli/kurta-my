import { SortFilterItem } from '@kurta-my/types';

export const defaultSort: SortFilterItem = {
  title: 'Relevance',
  slug: 'relevance',
  sortKey: 'RELEVANCE'
};

export const sorting: SortFilterItem[] = [
  defaultSort,
  {
    title: 'Latest',
    slug: 'latest-desc',
    sortKey: 'CREATED_AT',
    reverse: true
  },
  {
    title: 'Price: Low to high',
    slug: 'price-asc',
    sortKey: 'PRICE'
  },
  {
    title: 'Price: High to low',
    slug: 'price-desc',
    sortKey: 'PRICE',
    reverse: true
  }
]; 