import React, { useEffect, useState } from "react";

const slides = [
    {
        image: "https://ismailvtl-images-project.vercel.app/startup-launch.png",
        title: "Turn your ideas into reality.",
        description:
            "Consistent quality and experience across all platforms and devices",
    },
    {
        image: "https://ismailvtl-images-project.vercel.app/cloud-storage.png",
        title: "Turn your ideas into reality.",
        description:
            "Consistent quality and experience across all platforms and devices",
    },
    {
        image: "https://ismailvtl-images-project.vercel.app/cloud-storage.png",
        title: "Turn your ideas into reality.",
        description:
            "Consistent quality and experience across all platforms and devices",
    },
];

const AutoSlider = () => {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 3000); // Auto-slide every 3 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full max-w-4xl mx-auto overflow-hidden rounded-xl ">
            {/* Slides container */}
            <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${current * 100}%)` }}
            >
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className="flex flex-col md:flex-row items-center justify-center flex-shrink-0 w-full p-8 md:p-16  gap-12"
                    >
                        {/* Slide Image */}
                        <div className="w-full md:w-1/2 flex justify-center">
                            <img
                                src={slide.image}
                                alt={slide.title}
                                loading="lazy"
                                className="w-72 md:w-96 object-contain"
                            />
                        </div>

                        {/* Slide Content */}
                        <div className="w-full md:w-1/2 mt-6 md:mt-0 text-center md:text-left">
                            <h2 className="text-2xl font-bold text-white">
                                {slide.title}
                            </h2>
                            <p className="mt-2 text-primary-300">{slide.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Dots Navigation */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrent(index)}
                        className={`w-3 h-3 rounded-full transition-all ${current === index ? "bg-gray-800" : "bg-gray-400"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default AutoSlider;
