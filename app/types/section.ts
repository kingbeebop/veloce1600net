// types/section.ts

export interface Section {
  title: string;
  header: string | null;
  image: string;
  content: ContentItem[];
  buttons?: ButtonAction[];
}

export interface ContentItem {
  variant: 'body1' | 'body2' | 'h1' | 'h2'; // Add other variants as needed
  text: string;
}

// Define ButtonAction Type
export interface ButtonAction {
  name: string;
  action: () => void;
}

// Define SectionProps Type
export interface SectionProps {
  title: string;
  header: string | null;
  image: string;
  content: ContentItem[]; // Use the structured content type
  buttons?: ButtonAction[];
}

export interface SectionData {
  title: string;
  header?: string; // Optional header
  image: string;
  content: ContentItem[];
  buttons?: ButtonAction[];
}