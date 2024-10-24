import { SectionData } from '../types/section'; // Use the SectionData type now

const preloadImage = (src: string) => {
  return new Promise<void>((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve();
    img.onerror = (err) => reject(err);
  });
};

export const preloadSectionImages = async () => {
  const sectionNames = ['About', 'Contact', 'Services', 'Events', 'Sell', 'Store']; // List of sections to preload

  const sections: SectionData[] = await Promise.all(
    sectionNames.map(async (sectionName) => {
      try {
        // Import the data file for each section dynamically
        const { [sectionName.toLowerCase() + 'SectionData']: sectionData }: { [key: string]: SectionData } = await import(
          `../components/sections/${sectionName}/data`
        );
        return sectionData; // Return the section data
      } catch (error) {
        console.error(`Error loading data for section: ${sectionName}`, error);
        throw error;
      }
    })
  );

  console.log(sections); // For debugging purposes

  // Extract image paths and preload them
  const imagePaths = sections
    .map((section) => section.image)
    .filter((image) => !!image); // Filter out any falsy images

  // Preload all images
  const preloadPromises = imagePaths.map((src) => preloadImage(src));
  await Promise.all(preloadPromises);
};
