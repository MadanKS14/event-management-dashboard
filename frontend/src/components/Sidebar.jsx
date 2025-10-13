import React from 'react'
import { NavLink } from 'react-router-dom'


const items = [
{ to: '/dashboard', label: 'Dashboard' },
{ to: '/events', label: 'Events' },
{ to: '/attendees', label: 'Attendees' },
{ to: '/tasks', label: 'Tasks' },
{ to: '/calendar', label: 'Calendar' },
]


export default function Sidebar() {
return (
<aside className="w-64 bg-white border-r min-h-screen p-4">
<h2 className="text-xl font-semibold mb-6">EventDash</h2>
<nav className="flex flex-col gap-2">
{items.map(i => (
<NavLink
key={i.to}
to={i.to}
className={({ isActive }) =>
`px-3 py-2 rounded ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`
}
>
{i.label}
</NavLink>
))}
</nav>
</aside>
)
}