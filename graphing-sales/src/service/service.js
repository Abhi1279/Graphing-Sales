import axios from 'axios';

export const fetchSalesData = async (year) => {
  try {
    const response = await axios.get('https://fakestoreapi.com/products');

    const dataByYear = response.data.filter((product) => {
      if (year === '2024') return product.id % 3 === 0; 
      if (year === '2023') return product.id % 2 === 0; 
      if (year === '2022') return product.id % 5 === 0;
    });
    
    return dataByYear;
  } catch (error) {
    console.error('Error fetching sales data:', error);
    throw error;
  }
};
