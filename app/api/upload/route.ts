import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {

  try {
    const data = await request.json();
    if (!data || data.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Tidak ada item yang dipilih.' },
        { status: 400 }
      );
    }
    const generateRandomId = () => `${Date.now()}-${Math.floor(Math.random() * 1000000)}`;

    const general = await prisma.general_id.create({
      data: {
        id: generateRandomId(),
        id_user: 1244
      }
    })

    const generalId = general.id
    for (const item of data) {
      await prisma.keputusan.create({
        data: {
          general_id: generalId, 
          kode_gejala: item.kode, 
          kode_diagnosis: item.kode_diagnosis,
          bool: true,
        },
      });
    }
    const gejala = await prisma.gejala.findMany();
    const keputusan = await prisma.keputusan.findMany({
      where: { general_id: generalId },
    });
    
    const gejalaData = gejala.map((item) => item.kode_diagnosis);
    const kodeDiagnosisKeputusan = keputusan.map((item) => item.kode_diagnosis);

    const countKeputusan = kodeDiagnosisKeputusan.reduce((acc, kode) => {
      acc[kode] = (acc[kode] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const countGejala = gejalaData.reduce((acc, kode) => {
      acc[kode] = (acc[kode] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const combinedData = Object.entries(countKeputusan).map(([kode, countKeputusan]) => {
      const countGejalaValue = countGejala[String(kode)] || 0;
      const difference = Math.abs(countKeputusan - countGejalaValue);
      const roundUp = countGejalaValue > 0
        ? (Math.min(countKeputusan, countGejalaValue) / countGejalaValue) * 100
        : 0;
      const accuracy = Math.ceil(roundUp);


      return {
        general_id: generalId,
        kode_diagnosis: String(kode),
        count_keputusan: countKeputusan,
        count_gejala: countGejalaValue,
        accuracy,
        difference,
      };
    });

    const sortedByAccuracy = combinedData.sort((a, b) => b.accuracy - a.accuracy);
    console.log("Sorted by Accuracy:", sortedByAccuracy);

    if (sortedByAccuracy.length > 0) {
      await Promise.all(
        sortedByAccuracy.map(async (unit) => {
          try {
            await prisma.prediksi.create({
              data: {
                id_user: 1244,
                general_id: unit.general_id,
                kode_diagnosis: unit.kode_diagnosis,
                count_keputusan: unit.count_keputusan,
                count_gejala: unit.count_gejala,
                accuracy: unit.accuracy,
                difference: unit.difference,
              },
            });
          } catch (error) {
            return error
          }
        })
      );
    }
    return NextResponse.json({ success: true, message: 'Data berhasil diterima.', token: general.id });
  } catch (error) {
    console.error('Error processing form data:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan saat memproses data.' },
      { status: 500 }
    );
  }
}
