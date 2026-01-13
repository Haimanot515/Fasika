import React from 'react';

const Weather = () => {
    return (
        <div className="p-8">
            <div className="max-w-4xl">
                <h2 className="text-3xl font-black text-gray-900 mb-2">Regional Market Climate</h2>
                <p className="text-gray-500 font-medium mb-12">Weather patterns impacting local supply and pricing.</p>

                <div className="bg-blue-600 rounded-[56px] p-12 text-white shadow-2xl shadow-blue-100 mb-10 overflow-hidden relative">
                    <div className="absolute -top-10 -right-10 text-[180px] opacity-10">☀️</div>
                    <div className="relative z-10">
                        <div className="inline-block bg-white/20 px-6 py-2 rounded-full text-sm font-bold backdrop-blur-md mb-8">System Outlook</div>
                        <h3 className="text-4xl font-black mb-6 leading-tight">Stable conditions favor <br /> consistent harvest.</h3>
                        <p className="text-blue-100 text-lg max-w-lg mb-10">Minimal weather disruption expected in the primary supply corridors for the next 7 days.</p>
                        <div className="flex gap-10">
                            <WeatherMiniStat label="Avg Humidity" value="45%" />
                            <WeatherMiniStat label="Wind Speed" value="12 km/h" />
                            <WeatherMiniStat label="Risk Level" value="Low" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-gray-50 p-10 rounded-[48px] border border-gray-100">
                        <h4 className="font-black text-gray-900 mb-4">Supply Forecast</h4>
                        <p className="text-gray-500 leading-relaxed">Vegetable availability remains high due to favorable rainfall in the central regions.</p>
                    </div>
                    <div className="bg-gray-50 p-10 rounded-[48px] border border-gray-100">
                        <h4 className="font-black text-gray-900 mb-4">Transport Advisory</h4>
                        <p className="text-gray-500 leading-relaxed">Major routes are clear. No weather-related transport delays reported for the weekend.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const WeatherMiniStat = ({ label, value }) => (
    <div>
        <p className="text-blue-200 text-xs font-black uppercase tracking-widest mb-1">{label}</p>
        <p className="text-2xl font-black">{value}</p>
    </div>
);

export default Weather;
