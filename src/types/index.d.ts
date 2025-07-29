export interface User {
  id: string
  name: string
  email: string
  role: "USER" | "ADMIN"
}

export interface Event {
  id: string
  name: string
  description: string
  date: string
  time: string
  location: string
  capacity: number
  availableSpots: number
}
