'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

type ItemsProps = {
  item: {
    text: string;
    id: number;
    kode: string;
    kode_diagnosis: string;
    deskripsi: string;
    createdAt: Date;
  }[];
};

const ItemGejala = ({ item }: ItemsProps) => {
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState<true | false>(false)
  const router = useRouter();

  console.log("Checked items:", checkedItems);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const selectedItems = item.filter(unit => checkedItems[unit.kode]);

    if (selectedItems.length === 0) {
      alert('Pilih minimal satu item.');
      return;
    }
    if (loading != true) {
      setLoading(!loading)
    }

    const jsonData = selectedItems.map(unit => ({
      id: unit.id,
      kode: unit.kode,
      kode_diagnosis: unit.kode_diagnosis,
      text: unit.text,
      deskripsi: unit.deskripsi,
      createdAt: unit.createdAt
    }));

    console.log("Data yang akan dikirim:", jsonData);

    try {
      const post = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonData),
        cache: "no-store",
      });

      const res = await post.json();
      if (res && res.success) {
        router.push(`/gejala?q=${res.token}`)
      } else {
        console.log('Gagal mengirim data:', res);
      }
    } catch (error) {
      console.error('Terjadi kesalahan:', error);
    }
  };

  const handleCheckboxChange = (kode: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [kode]: !prev[kode]
    }));
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-100">
      <form
        onSubmit={handleSubmit}
        className="bg-base shadow-lg rounded-lg p-8 w-full max-w-4xl"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Checklist Symptom</h2>
        <div className="grid grid-cols-2 gap-2 max-h-[50vh] overflow-y-scroll">
          {item.map((unit) => (
            <div
              key={unit.id}
              className="flex justify-between items-center p-3 border-b border-gray-200 last:border-none"
            >
              <p className="text-gray-700">{unit.text}</p>
              <input
                type="checkbox"
                className="checkbox checkbox-primary"
                value={unit.kode}
                checked={checkedItems[unit.kode] || false}
                onChange={() => handleCheckboxChange(unit.kode)}
              />
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-end">
          {loading ? (
            <button className="btn">
              <span className="loading loading-spinner"></span>
              Kirim
            </button>
          ) : (
            <button
              className="btn btn-primary px-6 py-2 text-white font-medium rounded-lg shadow-md hover:bg-blue-600 transition-all duration-300"
              type="submit">
              Kirim
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ItemGejala;
