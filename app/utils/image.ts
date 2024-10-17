// utils/imageUtils.ts
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5018";

export const getFullImagePath = (path: string | null): string => {
  if (!path) return '';
  console.log(`${API_BASE_URL}${path}`)
  return `${API_BASE_URL}${path}`;
};
