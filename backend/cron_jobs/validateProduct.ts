import axios from 'axios';
import * as cron from 'node-cron';

const apiUrl = 'http://localhost:3800/product/close-products';

// Function to call the API using Axios
const callApi = async () => {
  try {
    const response = await axios.get(apiUrl);
    console.log('API response:', response.data);
  } catch (error) {
    console.error('Error calling API:', error.message);
  }
};

// Schedule the cron job to run every 1 minute
cron.schedule('* * * * *', () => {
  console.log('Calling API...');
  callApi();
});