import { ContentItem, ButtonAction } from '../../../types/section';
import { navigateToCars } from './actions';


export const storeSectionData = {
  title: 'Store',
  header: null,
  image: '/store.jpg', // Update with actual image path
  content: [
    {
      variant: 'body1',
      text: 'Check out our super slick cars.',
    }
  ] as ContentItem[],
  buttons: [
    {
      name: 'Inventory',
      action: navigateToCars,
    }
  ] as ButtonAction[],
};

