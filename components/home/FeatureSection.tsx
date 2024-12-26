import React from 'react'
import Image from 'next/image'
interface Props {
    item: {
        id: number,
        title: string,
        text: string,
        leftText: string | null,
        imageUrl: string
    }[]
}

const FeatureSection = ({ item }: Props) => {
    return (
        <div>
            <h2 className="text-3xl mt-12 text-center font-bold">Main Advantages</h2>
            {item.map((item) => (
                <div key={item.id}>
                    {item.leftText ? (
                        <div className="hero mt-20">
                            <div className="hero-content flex-col lg:flex-row-reverse">
                                <Image
                                    alt="Image description"
                                    src={item.imageUrl}
                                    layout="intrinsic"
                                    width={600}
                                    height={600}
                                    className="h-5/6 object-contain w-full rounded-lg shadow-2xl lg:ml-40"
                                />
                                <div>
                                    <h4 className="py-2 text-2xl font-bold">{item.title}</h4>
                                    <p className='text-xl'>{item.text}</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="hero mt-20">
                            <div className="hero-content flex-col lg:flex-row">
                                <Image
                                    alt="Image description"
                                    src={item.imageUrl}
                                    layout="intrinsic"
                                    width={600}
                                    height={600}
                                    className="h-5/6 object-contain w-full rounded-lg shadow-2xl"
                                />
                                <div className='lg:ml-40'>
                                    <h4 className="py-2 text-2xl font-bold">{item.title}</h4>
                                    <p className='text-xl'>{item.text}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}

export default FeatureSection