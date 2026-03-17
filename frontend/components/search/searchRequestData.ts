// import axios from "axios"

// const BASE_URL = "http://192.168.29.162:8000"

// export const fetchSearchRequests = async () => {

//   const res = await axios.get(`${BASE_URL}/admin/search-requests`)

//   return res.data

// }

// export const deleteSearchRequest = async (id:number) => {

//   const res = await axios.delete(`${BASE_URL}/admin/search-request/${id}`)

//   return res.data

// }
import api from "@/lib/axios"

// ---------------- SEARCH REQUESTS ----------------

export const fetchSearchRequests = async () => {
  const res = await api.get("/admin/search-requests")
  return res.data
}

export const deleteSearchRequest = async (id: number) => {
  const res = await api.delete(`/admin/search-request/${id}`)
  return res.data
}
