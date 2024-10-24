import { ContentItem, ButtonAction } from '../../../types/section';

export const contactSectionData = {
  title: 'Contact Us',
  header: null,
  image: '/contact.jpg',
  content: [
    {
      variant: 'body1',
      text: 'We would love to hear from you! Reach out to us through the following channels.',
    },
    {
      variant: 'body1',
      text: 'Email: support@ourcompany.com',
    },
    {
      variant: 'body1',
      text: 'Phone: (123) 456-7890',
    },
  ] as ContentItem[],
  buttons: [
    {
      name: 'Send Message',
      action: () => {
        console.log('Send Message clicked');
      },
    },
    {
      name: 'Follow Us',
      action: () => {
        console.log('Follow Us clicked');
      },
    },
  ] as ButtonAction[],
};
