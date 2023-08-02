import axios from 'axios'

const newRequest = axios.create({
  baseURL: 'https://reconx-server.onrender.com',
})

export default newRequest
