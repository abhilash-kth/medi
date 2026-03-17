// import axios from "axios";
// const api = axios.create({
//     baseURL:"http://192.168.29.162:8000",
//     timeout:10000,
//     headers:{
//         "Content-Type":"application/json",
//     }
// })

// export default api

import axios from "axios"

const api = axios.create({
  baseURL: "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// ✅ ADD THIS
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token")

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }

  return config
})

export default api
