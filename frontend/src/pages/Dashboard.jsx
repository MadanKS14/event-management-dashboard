// src/pages/Dashboard.jsx
import React from 'react'
import { useQuery } from "@tanstack/react-query";
import { eventsApi } from '../services/api'
import toast from 'react-hot-toast'

export default function Dashboard() {
  const { data: eventsData } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      try {
        const res = await eventsApi.getAll()
        return res.data
      } catch (err) {
        toast.error('Failed to load events')
        return []
      }
    },
  })

  const totalEvents = eventsData?.length ?? 0

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded shadow">
          Total Events<br />
          <div className="text-3xl font-semibold">{totalEvents}</div>
        </div>
        <div className="p-4 bg-white rounded shadow">
          Total Attendees<br />
          <div className="text-3xl font-semibold">—</div>
        </div>
        <div className="p-4 bg-white rounded shadow">
          Tasks Completed<br />
          <div className="text-3xl font-semibold">—</div>
        </div>
      </div>
    </div>
  )
}
