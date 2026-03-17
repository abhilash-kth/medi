// "use client"

// import { useState } from "react"
// import axios from "axios"

// import { Button } from "@/components/ui/button"
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import { Input } from "@/components/ui/input"

// const BASE_URL = "http://192.168.29.162:8000"

// export function AddMedicineDialog({ request }: any) {

//   const [variant, setVariant] = useState(request.variant || "")
//   const [loading, setLoading] = useState(false)

//   const handleCreate = async () => {

//     try {

//       setLoading(true)

//       const res = await axios.post(
//         `${BASE_URL}/admin/create-medicine-from-request/${request.id}`
//       )

//       if (res.data.status === "MEDICINE_CREATED") {
//         alert("Medicine created successfully")
//       }

//       if (res.data.status === "MEDICINE_ALREADY_EXISTS") {
//         alert("Medicine already exists")
//       }

//       // refresh page
//       window.location.reload()

//     } catch (error:any) {

//       console.error(error)

//       alert(error.response?.data?.detail || "Failed to create medicine")

//     } finally {

//       setLoading(false)

//     }

//   }

//   return (
//     <Dialog>

//       <DialogTrigger asChild>
//         <Button size="sm">Add</Button>
//       </DialogTrigger>

//       <DialogContent>

//         <DialogHeader>
//           <DialogTitle>Add Medicine</DialogTitle>
//         </DialogHeader>

//         <div className="space-y-4">

//           <Input
//             defaultValue={request.brand}
//             placeholder="Brand"
//             disabled
//           />

//           <Input
//             defaultValue={request.strength}
//             placeholder="Strength"
//             disabled
//           />

//           <Input
//             defaultValue={request.form}
//             placeholder="Form"
//             disabled
//           />

//           <Input
//             value={variant}
//             placeholder="Variant (NORMAL / XR / SR)"
//             onChange={(e)=>setVariant(e.target.value)}
//           />

//           <Button
//             className="w-full btn-primary"
//             onClick={handleCreate}
//             disabled={loading}
//           >
//             {loading ? "Creating..." : "Save Medicine"}
//           </Button>

//         </div>

//       </DialogContent>

//     </Dialog>
//   )
// }

"use client"

import { useState } from "react"
import api from "@/lib/axios"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

export function AddMedicineDialog({ request }: any) {
  const [variant, setVariant] = useState(request.variant || "")
  const [loading, setLoading] = useState(false)

  const handleCreate = async () => {
    try {
      setLoading(true)

      const res = await api.post(
        `/admin/create-medicine-from-request/${request.id}`,
        {
          variant, // ✅ send updated variant if needed
        }
      )

      if (res.data.status === "MEDICINE_CREATED") {
        alert("Medicine created successfully")
      }

      if (res.data.status === "MEDICINE_ALREADY_EXISTS") {
        alert("Medicine already exists")
      }

      // refresh page
      window.location.reload()
    } catch (error: any) {
      console.error(error)

      alert(
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        "Failed to create medicine"
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm">Add</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Medicine</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            defaultValue={request.brand}
            placeholder="Brand"
            disabled
          />

          <Input
            defaultValue={request.strength}
            placeholder="Strength"
            disabled
          />

          <Input
            defaultValue={request.form}
            placeholder="Form"
            disabled
          />

          <Input
            value={variant}
            placeholder="Variant (NORMAL / XR / SR)"
            onChange={(e) => setVariant(e.target.value)}
          />

          <Button
            className="w-full btn-primary"
            onClick={handleCreate}
            disabled={loading}
          >
            {loading ? "Creating..." : "Save Medicine"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
