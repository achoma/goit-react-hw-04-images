import axios from 'axios';

export const fetchGallery = async (q, page) => {
  const baseURL = `https://pixabay.com/api/?q=${q}&page=${page}&key=42580380-f7e9d56cf0d50abf8107b2707&image_type=photo&orientation=horizontal&per_page=12`;
  try {
    const response = await axios.get(baseURL);
    return response.data;
  } catch (error) {
    console.error('Fetching error:', error);
  }
};
