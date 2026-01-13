import React from 'react';

const ProductReports = () => {
    const reports = [
        { title: "Monthly Supply Audit", date: "Jan 2026", type: "PDF", size: "2.4 MB" },
        { title: "Price Volatility Record", date: "Q4 2025", type: "Excel", size: "1.1 MB" },
        { title: "Farmer Output Summary", date: "Dec 2025", type: "PDF", size: "890 KB" },
    ];

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-8 text-gray-800">Inventory & Market Reports</h2>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center text-sm font-semibold text-gray-500">
                    <span>Report Title</span>
                    <div className="flex gap-12 mr-10">
                        <span>Period</span>
                        <span>Format</span>
                    </div>
                </div>
                <div className="divide-y divide-gray-100">
                    {reports.map((report, idx) => (
                        <div key={idx} className="p-5 flex justify-between items-center hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded flex items-center justify-center font-bold text-xs uppercase">
                                    {report.type}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">{report.title}</h4>
                                    <p className="text-xs text-gray-500">{report.size}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-8">
                                <span className="text-gray-600 font-medium">{report.date}</span>
                                <button className="px-4 py-1.5 bg-gray-900 text-white rounded-lg text-sm font-bold hover:bg-green-700 transition-colors">Download</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductReports;
