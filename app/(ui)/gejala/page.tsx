'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Prediksi } from '@prisma/client'
const Page = () => {
    const [keputusan, setKeputusan] = useState<Prediksi[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const searchParams = useSearchParams();
    const key = searchParams.get('q');
    console.log("keputusan", keputusan)

    useEffect(() => {
        if (key) {
            const fetchData = async () => {
                try {
                    setLoading(true);
                    const response = await fetch(`/api/prediksi?q=${key}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });

                    if (!response.ok) {
                        throw new Error('Failed to fetch data');
                    }

                    const data = await response.json();
                    setKeputusan(data);
                } catch (err) {
                    console.log(err)
                } finally {
                    setLoading(false);
                }
            };

            fetchData();
        }
    }, [key]);

    if (loading) return <p>Loading...</p>;

    if (keputusan.length > 0) {
        return (
            <div className="overflow-x-auto px-4 py-6 bg-base-200 rounded-lg shadow">
                <div className="mt-4 mb-6 text-center">
                    <p className="font-bold text-2xl text-base-800">Diagnosis Results</p>
                    <p className="text-gray-600 text-sm mt-2">
                        Below is the summary of your diagnosis and certainty levels.
                    </p>
                </div>
                <table className="table-auto w-full bg-base rounded-lg">
                    <thead className="bg-green-500 text-white">
                        <tr>
                            <th className="px-4 py-2 border-r border-success">No</th>
                            <th className="px-4 py-2 border-r border-success">Diagnosis</th>
                            <th className="px-4 py-2 border-r border-success">Certainty</th>
                        </tr>
                    </thead>
                    <tbody>
                        {keputusan.map((item, index) => (
                            <tr
                                key={index}
                                className={`border-t ${index % 2 === 0 ? 'bg-green-50' : 'bg-green-100'}`}
                            >
                                <td className="px-4 py-2 border-r text-center font-medium text-base-700">
                                    {index + 1}
                                </td>
                                <td className="px-4 py-2 border-r text-center text-base-800 font-semibold">
                                    {item?.diagnosis.text}
                                </td>
                                <td className="px-4 py-2 border-r text-center font-semibold text-base-700">
                                    {item.accuracy} %
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    } else {
        return <p>No search parameter provided</p>;
    }
}

export default Page;
