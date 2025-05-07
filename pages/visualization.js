import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function MountingCalculator() {
  const router = useRouter();
  const [rows, setRows] = useState([{ orientation: '', count: '' }]);
  const lastRowRef = useRef(null);

  // Initialize rows with N from localStorage as the count for the first row
  useEffect(() => {
    const profileOption = localStorage.getItem('profileOption') || 'default';
    const savedResults = JSON.parse(localStorage.getItem(`roofingResult_${profileOption}`)) || {};
    const N = Number(savedResults.N) || ''; // Use N as count, default to empty string if not found
    setRows([{ orientation: '', count: N.toString() }]);
  }, []);

  const addRow = () => {
    setRows((prevRows) => {
      const updatedRows = [...prevRows, { orientation: '', count: '' }];
      setTimeout(() => {
        lastRowRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 0);
      return updatedRows;
    });
  };

  const handleRowChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);
  };

  const handleNext = () => {
    if (rows.every((row) => row.orientation && row.count)) {
      localStorage.setItem('rowsData', JSON.stringify(rows));
      router.push('/result');
    } else {
      alert('Будь ласка, заповніть усі ряди перед продовженням.');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0C0E3A] text-white">
      {/* Header */}
      <header className="fixed top-0 w-full bg-[#0C0E3A] text-white z-10 p-4">
        <h1 className="text-3xl font-bold">КАЛЬКУЛЯТОР КРІПЛЕННЯ</h1>
        <div className="flex justify-center mt-4 space-x-2">
          {[...Array(10)].map((_, index) => (
            <div
              key={index}
              className={`w-8 h-8 border-2 rounded-full flex items-center justify-center ${
                index === 5
                  ? 'border-yellow-400 text-yellow-400'
                  : 'border-gray-400 text-gray-400'
              }`}
            >
              {index + 1}
            </div>
          ))}
        </div>
      </header>

      {/* Content */}
      <div
        className="flex-grow flex flex-col items-center justify-start px-4 pt-24 overflow-y-auto mb-24"
        style={{ maxHeight: 'calc(100vh - 160px)' }}
      >
        <div className="flex flex-col w-full max-w-xl space-y-8">
          {rows.map((row, index) => (
            <div
              key={index}
              className="w-full max-w-xl"
              ref={index === rows.length - 1 ? lastRowRef : null}
            >
              <h2 className="text-lg font-bold">РЯД {index + 1}</h2>
              <div className="flex flex-col md:flex-row items-center md:space-x-4 mt-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id={`vertical-${index}`}
                    name={`orientation-${index}`}
                    value="vertical"
                    checked={row.orientation === 'vertical'}
                    onChange={() => handleRowChange(index, 'orientation', 'vertical')}
                    className="hidden"
                  />
                  <label
                    htmlFor={`vertical-${index}`}
                    className={`px-4 py-2 border-2 rounded-lg cursor-pointer ${
                      row.orientation === 'vertical'
                        ? 'border-yellow-400 bg-yellow-400 text-black'
                        : 'border-gray-400'
                    }`}
                  >
                    ВЕРТИКАЛЬНА
                  </label>

                  <input
                    type="radio"
                    id={`horizontal-${index}`}
                    name={`orientation-${index}`}
                    value="horizontal"
                    checked={row.orientation === 'horizontal'}
                    onChange={() => handleRowChange(index, 'orientation', 'horizontal')}
                    className="hidden"
                  />
                  <label
                    htmlFor={`horizontal-${index}`}
                    className={`px-4 py-2 border-2 rounded-lg cursor-pointer ${
                      row.orientation === 'horizontal'
                        ? 'border-yellow-400 bg-yellow-400 text-black'
                        : 'border-gray-400'
                    }`}
                  >
                    ГОРИЗОНТАЛЬНА
                  </label>
                </div>

                <input
                  type="number"
                  placeholder="Кількість"
                  value={row.count}
                  onChange={(e) => handleRowChange(index, 'count', e.target.value)}
                  className="mt-4 md:mt-0 px-4 py-2 border-2 border-gray-400 rounded-lg text-black"
                />
              </div>

              {/* Panels */}
              <div
                className={`w-full border-2 border-gray-400 rounded-lg overflow-hidden flex`}
                style={{
                  backgroundColor: '#D9D9D9',
                  flexDirection: 'row',
                  padding: '16px',
                  gap: row.orientation === 'horizontal' ? '32px' : '8px',
                  minHeight: '128px',
                  flexWrap: row.orientation === 'vertical' ? 'wrap' : 'nowrap',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                }}
              >
                {[...Array(Number(row.count) || 0)].map((_, panelIndex) => (
                  <div
                    key={panelIndex}
                    className="bg-gray-600 border-2 border-red-500"
                    style={{
                      width: '48px',
                      height: '64px',
                      transform: row.orientation === 'horizontal' ? 'rotate(90deg)' : 'none',
                    }}
                  ></div>
                ))}
              </div>
            </div>
          ))}

          <button
            onClick={addRow}
            className="px-6 py-3 bg-yellow-400 text-black font-semibold rounded-lg"
          >
            + ДОДАТИ РЯД
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="flex justify-between items-center p-8 fixed bottom-0 w-full bg-[#0C0E3A]">
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