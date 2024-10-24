// components/sections/Services/data.ts
import { ContentItem, ButtonAction } from '../../../types/section';

export const servicesSectionData = {
  title: 'Services',
  header: null,
  image: '/services.jpg', // Update with actual image path
  content: [
    {
      variant: 'body1',
      text: 'We are proud to offer a full range of auction listing services to the distinguished enthusiast and collector car aficionado.',
    },
    {
      variant: 'body1',
      text: 'Below are some of our offerings. As of January 2023, we have partnered with online auction platform Bring a Trailer.',
    },
  ] as ContentItem[],
  buttons: [
    {
      name: 'Mechanical Service',
      action: () => {
        console.log('Mechanical Service clicked');
      },
    },
    {
      name: 'Restorative Detailing',
      action: () => {
        console.log('Restorative Detailing clicked');
      },
    },
    {
      name: 'Unique Content',
      action: () => {
        console.log('Unique Content clicked');
      },
    },
    {
      name: 'Collection Consulting',
      action: () => {
        console.log('Collection Consulting clicked');
      },
    },
    {
      name: 'Storage',
      action: () => {
        console.log('Storage clicked');
      },
    },
    {
      name: 'Transportation',
      action: () => {
        console.log('Transportation clicked');
      },
    },
  ] as ButtonAction[],
};
