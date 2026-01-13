import React from 'react';

const Weather = () => {
    const forecasts = [
        { day: "Monday", temp: "24°C", condition: "Sunny", advice: "Ideal for grain drying." },
        { day: "Tuesday", temp: "21°C", condition: "Light Rain", advice: "Cover sensitive crops." },
        { day: "Wednesday", temp: "22°C", condition: "Cloudy", advice: "Apply fertilizer early morning." },
    ];

    return (
        <div className="p-8">
            <div className="mb-12">
                <h2 className="text-3xl font-black text-blue-900 mb-2">Localized Weather Advisory</h2>
                <p className="text-gray-500 font-medium">Bishoftu Regional Data • Updated 10 mins ago</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {forecasts.map((f, i) => (
                    <div key={i} className={`p-8 rounded-[48px] border-2 transition-all ${i === 0 ? 'bg-blue-600 text-white border-transparent shadow-2xl shadow-blue-200 scale-105' : 'bg-white border-gray-100 text-gray-900 shadow-sm'
                        }`}>
                        <h4 className="text-xl font-black mb-6">{f.day}</h4>
                        <div className="text-5xl mb-4">{f.condition === 'Sunny' ? '☀️' : f.condition === 'Light Rain' ? '🌦️' : '☁️'}</div>
                        <p className="text-3xl font-black mb-1">{f.temp}</p>
                        <p className={`font-bold uppercase text-[10px] tracking-widest ${i === 0 ? 'text-blue-200' : 'text-gray-400'}`}>{f.condition}</p>
                        <div className={`mt-8 pt-6 border-t font-medium text-sm ${i === 0 ? 'border-blue-500 text-blue-100' : 'border-gray-50 text-gray-500'}`}>
                            <span className="font-black block uppercase text-[10px] mb-1">Advisory:</span>
                            {f.advice}
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-gray-900 rounded-[56px] p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                    <h3 className="text-2xl font-bold mb-2">Extended Climate Forecast</h3>
                    <p className="text-gray-400">Expect a 20% increase in rainfall over the next two weeks.</p>
                </div>
                <button className="bg-white text-gray-900 px-10 py-4 rounded-3xl font-black hover:bg-blue-400 transition-colors">Download PDF Guide</button>
            </div>
        </div>
    );
};

export default Weather;
