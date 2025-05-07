import { useState } from 'react';
import { useRouter } from 'next/router';

export default function CalculatorStart() {
  const [objectName, setObjectName] = useState('');
  const [region, setRegion] = useState('');
  const router = useRouter();
  const handleNext = () => {
    const formData = { objectName, region };
    localStorage.setItem('calculatorData', JSON.stringify(formData));


    router.push('/autorization');
  };

  return (
    <div className="flex flex-col h-screen bg-[#0C0E3A] text-white">
      {/* Header */}
      <header className="flex flex-col items-center mt-4">
        <h1 className="text-3xl font-bold">КАЛЬКУЛЯТОР КРІПЛЕННЯ</h1>
        <div className="flex justify-center mt-4 space-x-2">
          {[...Array(10)].map((_, index) => (
            <div
              key={index}
              className={`w-8 h-8 border-2 rounded-full flex items-center justify-center ${
                index === 0 ? 'border-yellow-400 text-yellow-400' : 'border-gray-400 text-gray-400'
              }`}
            >
              {index + 1}
            </div>
          ))}
        </div>
      </header>

      {/* Main content */}
      <div className="flex-grow flex items-center justify-center">
        <div className="grid grid-cols-2 gap-8 w-full max-w-4xl p-8">
          <div>
            <label className="block mb-2 text-xl">НАЗВА ОБ`ЄКТУ</label>
            <input
              type="text"
              value={objectName}
              onChange={(e) => setObjectName(e.target.value)}
              className="w-full p-3 rounded-lg bg-white text-black"
              placeholder="Деталі про об'єкт"
            />
          </div>
          <div>
            <label className="block mb-2 text-xl">РОЗМІЩЕННЯ ОБ`ЄКТА</label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full p-3 rounded-lg bg-white text-black"
            >
              <option value="">Область</option>
              <option value="Закарпатська">Закарпатська</option>
              <option value="Львівська">Львівська</option>
              <option value="Івано-Франківська">Івано-Франківська</option>
              <option value="Київська">Київська</option>
              <option value="Тернопільська">Тернопільська</option>
              <option value="Одеська">Одеська</option>
            </select>
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
