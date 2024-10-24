// components/sections/About/data.ts
import { ContentItem, ButtonAction } from '../../../types/section';

export const aboutSectionData = {
  title: 'About',
  header: null,
  image: '/about.jpg', // Update with actual image path
  content: [
    {
      variant: 'body1',
      text: '**1600Veloce** is an automotive lifestyle, media, service company and one of the largest online retailers of vintage cars.',
    },
    {
      variant: 'body1',
      text: 'In January 2023, Bring a Trailer (BaT), a digital auction platform and enthusiast community and division of Hearst, announced its strategic partnership with brands across the US. The joint venture aims to create a network of trusted professionals in the BaT community who can help provide the best result for a classic or enthusiast vehicle.',
    },
    {
      variant: 'body1',
      text: 'Since 2014 we have helped hundreds of BaT community members produce a winning online auction listing and are proud to be an official partner. Follow us @1600Veloce.',
    },
  ] as ContentItem[], // Use the structured type
  buttons: [
    {
      name: 'Learn More',
      action: () => {
        console.log('Learn More clicked');
      },
    },
    {
      name: 'Contact Us',
      action: () => {
        console.log('Contact Us clicked');
      },
    },
  ] as ButtonAction[], // Use the structured type
};
