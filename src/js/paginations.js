import axios from 'axios';

const getItemsPerPage = () => {
  const screenWidth = window.innerWidth;

  if (screenWidth < 768) {
  } else { 
    return 12;
  }
};

const fetchData = async (category, page) => {
  const limit = getItemsPerPage();

  try {
    const response = await axios.get('https://your-energy.b.goit.study/api/filters', {
      params: {
        filter: category,
        page: page,
        limit: limit
      }
    });

    console.log(response.data);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};
