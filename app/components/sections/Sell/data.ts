import { ContentItem, ButtonAction } from '../../../types/section';

export const sellSectionData = {
  title: 'Sell with Us',
  header: null,
  image: '/sell.jpg', // Update with actual image path
  content: [
    {
      variant: 'body1',
      text: 'Selling a vehicle on your own can be a frustrating and time-consuming process.',
    },
    {
      variant: 'body1',
      text: 'Tap into our understanding of how to present a quality, targeted listing on a virtual auction platform and experience what it’s like to get top dollar for your vehicle.',
    },
    {
      variant: 'body1',
      text: 'We are one of the largest virtual specialty car dealerships in the country and take pride in our proven track record.'
    },
    {
      variant: 'body1',
      text: 'Over 1,300 online listings has proven that our professional, transparent process works.'
    }
  ] as ContentItem[],
  buttons: [
    {
      name: 'Submit Your Car',
      action: () => {
        console.log('Start Selling clicked');
      },
    }
  ] as ButtonAction[],
};
