// components/sections/Events/data.ts
import { ContentItem, ButtonAction } from '../../../types/section';

export const eventsSectionData = {
  title: 'Events',
  image: '/events.jpg',
  header: 'Let’s Go For a Drive', // New optional header key
  content: [
    {
      variant: 'body1',
      text: 'Join the 1600Veloce team for events, gallery openings, cars & coffee and more.',
    },
  ] as ContentItem[],
  buttons: [
    {
      name: 'Reserve Our Space',
      action: () => {
        console.log('Reserve Our Space clicked');
      },
    },
    {
      name: 'Past Events',
      action: () => {
        console.log('Past Events clicked');
      },
    },
  ] as ButtonAction[],
};
