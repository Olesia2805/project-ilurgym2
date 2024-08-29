import axios from 'axios';

const fetchData = async (category, page) => {
  const screenWidth = window.innerWidth;
  const limit = screenWidth < 768 ? 9 : 12;
  
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

const fetchExercises = async (page) => {
  const screenWidth = window.innerWidth;
  const limit = screenWidth < 768 ? 8 : 10;
  
  try {
    const response = await axios.get('https://your-energy.b.goit.study/api/exercises', {
      params: {
        page: page,
        limit: limit
      }
    });

    console.log('Exercises Data:', response.data);
  } catch (error) {
    console.error('Error fetching exercises data:', error);
  }
};

// fetchData('Muscles', 1);
// fetchExercises(1); 
