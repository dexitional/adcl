import Link from 'next/link'
import React from 'react'

export default function BranchItem({title}:any) {
  return (
    <Link href='/'>
    <div className={`border bg-blue-200/50 hover:bg-gray-200/50  mx-2 py-2 px-5 flex items-center space-x-4 rounded-md cursor-pointer`}>
      <h3 className="text-blue-900 text-md text-center font-bold">{title}</h3>
    </div>
    </Link>
  )
}
