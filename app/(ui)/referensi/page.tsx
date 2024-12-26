import Link from 'next/link'
import React from 'react'

export default function page() {
  return (
    <div className='flex gap-4 m-10'>
        <Link className="link link-primary" href="https://perawat.org/">Sumber data</Link>
        <Link className="link link-primary" href="https://unsplash.com/">Sumber gambar</Link>
    </div>
  )
}
