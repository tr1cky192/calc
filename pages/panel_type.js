import { useState } from 'react';
import { useRouter } from 'next/router';

export default function RoofTypeSelection() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState(null);

  const handleSelection = (type) => {
    setSelectedType(type);
  };

  const handleNext = () => {
    if (selectedType) {
      const formData = { selectedType };
    localStorage.setItem('panelType', JSON.stringify(formData));
      router.push(`/coating_type/${selectedType}`);
    } else {
      alert('Будь ласка, виберіть тип покрівлі!');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0C0E3A] text-white">
      {/* Header */}
      <header className="flex flex-col items-center mt-4">
  <div className="flex items-center">
  <h1 className="text-3xl font-bold">КАЛЬКУЛЯТОР КРІПЛЕННЯ</h1>
  </div>
  <div className="flex justify-center mt-4 space-x-2">
    {[...Array(10)].map((_, index) => (
      <div
        key={index}
        className={`w-8 h-8 border-2 rounded-full flex items-center justify-center ${index === 3 ? 'border-yellow-400 text-yellow-400' : 'border-gray-400 text-gray-400'}`}
      >
        {index + 1}
      </div>
    ))}
  </div>
</header>

      {/* Main content */}
      <div className="flex-grow flex items-center justify-center">
        <div className="grid grid-cols-2 gap-8 w-full max-w-4xl p-8">
          {/* Pitched Roof */}
          <div
            onClick={() => handleSelection('pitched')}
            className={`flex flex-col items-center justify-center border-2 rounded-lg p-8 cursor-pointer ${selectedType === 'pitched' ? 'border-yellow-400' : 'border-gray-500'}`}
          >
            <div className="w-32 h-32 bg-gray-400 mb-4"></div>
            <p className="text-xl">ПОХИЛА</p>
          </div>

          {/* Flat Roof */}
          <div
            onClick={() => handleSelection('flat')}
            className={`flex flex-col items-center justify-center border-2 rounded-lg p-8 cursor-pointer ${selectedType === 'flat' ? 'border-yellow-400' : 'border-gray-500'}`}
          >
            <div className="w-32 h-32 bg-gray-400 mb-4"></div>
            <p className="text-xl">ПЛОСКА</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="flex justify-between p-8">
        <button
          className="px-6 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg"
          onClick={() => router.back()}
        >
          НАЗАД
        </button>
        <button
          className="px-6 py-3 bg-yellow-400 text-black font-semibold rounded-lg"
          onClick={handleNext}
        >
          ДАЛІ
        </button>
      </footer>
    </div>
  );
}
