import { cache } from "react";
import prisma from "../prisma";

const getGejala = cache(async () => {
    try {
        return await prisma.gejala.findMany();
    } catch (error) {
        console.error("Error fetching gejala:", error);
        throw error;
    }
});

const getKeputusan = cache(async (key: string) => {
    try {
        
        const prediksi = await prisma.prediksi.findMany({
            where: {
                general_id: key
            },
            include: {
                diagnosis: true
            }
        })
        return prediksi
    } catch (error) {
        console.error("Error in getKeputusan:", error);
        throw error;
    }
});

const dataService = {
    getGejala,
    getKeputusan,
};

export default dataService;
