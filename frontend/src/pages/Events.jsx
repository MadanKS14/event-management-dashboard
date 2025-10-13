import React, { useState } from 'react'
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { eventsApi } from '../services/api'
import toast, { Toaster } from 'react-hot-toast'
import EventModal from '../components/EventModal'

export default function Events() {
  const [open, setOpen] = useState(false)
  const [editEvent, setEditEvent] = useState(null)

  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery('events', async () => {
    const res = await eventsApi.getAll()
    return res.data
  })

  const createMut = useMutation((data) => eventsApi.create(data), {
    onSuccess: () => { queryClient.invalidateQueries('events'); toast.success('Event created') },
    onError: () => toast.error('Failed to create')
  })

  const updateMut = useMutation(({ id, data }) => eventsApi.update(id, data), {
    onSuccess: () => { queryClient.invalidateQueries('events'); toast.success('Event updated') },
    onError: () => toast.error('Failed to update')
  })

  const deleteMut = useMutation((id) => eventsApi.remove(id), {
    onSuccess: () => { queryClient.invalidateQueries('events'); toast.success('Deleted') },
    onError: () => toast.error('Failed to delete')
  })

  const onSave = (payload) => {
    if (editEvent) {
      updateMut.mutate({ id: editEvent._id, data: payload })
      setEditEvent(null)
    } else {
      createMut.mutate(payload)
    }
    setOpen(false)
  }

  return (
    <div>
      <Toaster />
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Events</h1>
        <div>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={() => { setEditEvent(null); setOpen(true) }}
          >
            Add Event
          </button>
        </div>
      </div>

      <div className="bg-white rounded shadow overflow-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Location</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan="4" className="p-4">Loading...</td></tr>
            ) : (data?.map(ev => (
              <tr key={ev._id} className="border-t">
                <td className="p-3">{ev.name}</td>
                <td className="p-3">{ev.location}</td>
                <td className="p-3">{new Date(ev.date).toLocaleDateString()}</td>
                <td className="p-3">
                  <button className="mr-2 text-sm px-2 py-1 bg-gray-100 rounded" onClick={() => { setEditEvent(ev); setOpen(true) }}>Edit</button>
                  <button className="text-sm px-2 py-1 bg-red-50 text-red-600 rounded" onClick={() => deleteMut.mutate(ev._id)}>Delete</button>
                </td>
              </tr>
            ))) }

            {(!isLoading && (!data || data.length === 0)) && (
              <tr><td colSpan="4" className="p-4">No events found. Click "Add Event" to create one.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {open && (
        <EventModal
          initialData={editEvent}
          onClose={() => { setOpen(false); setEditEvent(null) }}
          onSave={onSave}
        />
      )}
    </div>
  )
}
