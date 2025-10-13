import React from 'react'


export default function Navbar() {
return (
<header className="flex items-center justify-between p-4 border-b bg-white">
<div className="text-lg font-medium">Event Management Dashboard</div>
<div className="flex items-center gap-4">
<button className="px-3 py-1 rounded bg-gray-100">MK</button>
</div>
</header>
)
}