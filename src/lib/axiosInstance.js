import axios from 'axios'

const API_URL = 'https://api.nasa.gov/neo/rest/v1'

const AxiosInstance = axios.create({
  baseURL: API_URL,
  params: {
    api_key: 'DEMO_KEY'
  },
  headers: {
    'Content-Type': 'application/json'
  }
})

export default AxiosInstance