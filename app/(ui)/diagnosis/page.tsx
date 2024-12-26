import React from 'react'
import Form from './Form'
import { Metadata } from 'next'

export const metadata : Metadata = {
    title : "Gejala",
    description : "Diagnosis penyakit"
}
export default function page () {
    return (
        <Form />
    )
}

