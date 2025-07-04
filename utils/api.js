import axios from 'axios'
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL
//   baseURL: process.env.EXTERNAL_API_BASE_URL, // จาก .env
//   headers: {
//     Authorization: `Bearer ${process.env.API_KEY}`,
//     'Content-Type': 'application/json'
//   }
})

export default api