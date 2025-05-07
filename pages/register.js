import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Step3() {
  const router = useRouter();
  const [panelHeight, setPanelHeight] = useState('');
  const [panelWidth, setPanelWidth] = useState('');
  const [panelThickness, setPanelThickness] = useState('');
  const [panelPower, setPanelPower] = useState('');
  const [availablePanels] = useState([
    { id: 1, manufacturer: 'Квадрат', size: '1000x2000x40 мм', power: '500 Вт', availability: 'Немає в наявності' },
  ]);

  const handleNext = () => {
    router.push('/step4');
  };

  const handlePrev = () => {
    router.push('/autorization'); 
  };

  return (
    <div className="flex flex-col h-screen bg-[#0C0E3A] text-white">
      {/* Header */}
      <header className="text-center py-4">
        <h1 className="text-4xl font-bold">КАЛЬКУЛЯТОР КРІПЛЕННЯ</h1>
        <div className="flex justify-center mt-4 space-x-2">
          {[...Array(10).keys()].map((_, index) => (
            <div
              key={index}
              className={`w-8 h-8 border-2 rounded-full flex items-center justify-center ${
                index === 2 ? 'border-yellow-400 text-yellow-400' : 'border-gray-400 text-gray-400'
              }`}
            >
              {index + 1}
            </div>
          ))}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-10 space-y-8">
        <div className="text-center">
          <h2 className="text-2xl mb-4">РОЗМІРИ ПАНЕЛІ</h2>
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Висота мм"
              value={panelHeight}
              onChange={(e) => setPanelHeight(e.target.value)}
              className="w-32 px-4 py-2 rounded bg-white text-black"
            />
            <input
              type="text"
              placeholder="Ширина мм"
              value={panelWidth}
              onChange={(e) => setPanelWidth(e.target.value)}
              className="w-32 px-4 py-2 rounded bg-white text-black"
            />
            <input
              type="text"
              placeholder="Товщина мм"
              value={panelThickness}
              onChange={(e) => setPanelThickness(e.target.value)}
              className="w-32 px-4 py-2 rounded bg-white text-black"
            />
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl mb-4">ПОТУЖНІСТЬ ПАНЕЛІ</h2>
          <input
            type="text"
            placeholder="Потужність Вт"
            value={panelPower}
            onChange={(e) => setPanelPower(e.target.value)}
            className="w-40 px-4 py-2 rounded bg-white text-black"
          />
        </div>

        <div className="text-center">
          <h2 className="text-2xl mb-4">ПІДІБРАТИ З НАЯВНИХ НА СКЛАДІ</h2>
          <div className="grid grid-cols-3 gap-4">
            {availablePanels.map((panel) => (
              <div key={panel.id} className="bg-white text-black p-4 rounded-lg shadow-lg">
                <p>Виробник: {panel.manufacturer}</p>
                <p>Розміри: {panel.size}</p>
                <p>Потужність: {panel.power}</p>
                <p>Наявність: {panel.availability}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="flex justify-between items-center p-8">
        <button
          onClick={handlePrev}
          className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg"
        >
          НАЗАД
        </button>
        <button
          onClick={handleNext}
          className="bg-yellow-400 text-black px-6 py-3 rounded-lg"
        >
          ДАЛІ
        </button>
      </footer>
    </div>
  );
}
