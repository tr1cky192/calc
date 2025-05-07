import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Step3() {
  const router = useRouter();
  const [constants, setConstants] = useState({
    profileRows: 2,
    endClampReserve: 0.1,
    interModuleClampLength: 0.02,
    endClampsPerRow: 4,
    profileLengths: [3, 6],
    supportDistance: 1,
    L1: 3,
    L2: 6,
    panelWidths: [1.098, 1.134, 1.303],
  });

  const [, setIsAuthenticated] = useState(false);
  const [B, setB] = useState(constants.panelWidths[0] || 1.134);
  const [N, setN] = useState(1);
  const [panelHeight, setPanelHeight] = useState('');
  const [panelWidth, setPanelWidth] = useState('');
  const [panelThickness, setPanelThickness] = useState('');
  const [panelPower, setPanelPower] = useState('');
  const [selectedPanel, setSelectedPanel] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const visibleCount = 3;
  const [profileOption, setProfileOption] = useState('L1'); // або 'L1_L2'
  const [, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [panelWidthsInput, setPanelWidthsInput] = useState(constants.panelWidths.join(', ')); // Для редагування panelWidths

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedConstants = localStorage.getItem('mountingConstants');
      if (savedConstants) {
        try {
          const parsedConstants = JSON.parse(savedConstants);
          if (Array.isArray(parsedConstants.panelWidths)) {
            setConstants(parsedConstants);
            setPanelWidthsInput(parsedConstants.panelWidths.join(', '));
          } else {
            console.warn("Invalid panelWidths in saved constants.");
          }
        } catch (error) {
          console.error("Error parsing saved constants:", error);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPanelData = localStorage.getItem('selectedPanel');
      if (savedPanelData) {
        setSelectedPanel(JSON.parse(savedPanelData));
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('userData');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        console.log('Logged in user:', parsedUser);
        setUser(parsedUser);
        setIsAdmin(parsedUser.role === 'administrator');
      }
    }
  }, []);

  const availablePanels = [
    { id: 1, manufacturer: 'Квадрат', size: '1000x2000x40 мм', power: '500 Вт', availability: 'Немає в наявності' },
    { id: 2, manufacturer: 'Сонце', size: '1200x1800x35 мм', power: '400 Вт', availability: 'Є в наявності' },
    { id: 3, manufacturer: 'Енергія', size: '1100x1900x38 мм', power: '450 Вт', availability: 'Є в наявності' },
    { id: 4, manufacturer: 'Ефір', size: '1300x2100x42 мм', power: '600 Вт', availability: 'Є в наявності' },
    { id: 5, manufacturer: 'Люкс', size: '1400x2200x50 мм', power: '700 Вт', availability: 'Немає в наявності' },
  ];

  const saveConstants = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('mountingConstants', JSON.stringify(constants));
      alert('Значення збережено!');
    }
  };

  const handlePanelWidthsChange = (e) => {
    const input = e.target.value;
    setPanelWidthsInput(input);
    const widths = input.split(',').map((w) => parseFloat(w.trim())).filter((w) => !isNaN(w) && w > 0);
    setConstants({ ...constants, panelWidths: widths });
    if (widths.length > 0 && !widths.includes(B)) {
      setB(widths[0]);
    }
  };

  let result, N1, N2, Ln1, Ln12, NL1, NL2, NZ, L1N, Nz, Nmc, Ng;

  const rawResult = N === 1
    ? 1 * B + constants.endClampReserve * constants.endClampsPerRow / constants.profileRows
    : (N * B + constants.endClampReserve * constants.endClampsPerRow / constants.profileRows) + (N - 1) * constants.interModuleClampLength;

  result = Number(rawResult.toFixed(3));

  let savedResults = {};

  if (profileOption === 'L1') {
    N1 = Math.ceil(result / constants.L1);
    Ln1 = N1 * constants.L1;
    L1N = N1 * 2;
    Nz = L1N - 2;
    Nmc = (N - 1) * 2;
    Ng = Math.ceil(((result / constants.supportDistance) + 1) * constants.profileRows);

    savedResults = {
      N,
      result,
      profileOption,
      N1,
      Ln1,
      L1N,
      Nz,
      Nmc,
      Ng,
    };
  } else if (profileOption === 'L1_L2') {
    const roundedValue = Math.ceil(result / constants.L2 / 0.5) * 0.5;
    const integerPart = Math.floor(roundedValue);
    N1 = (roundedValue - integerPart > 0) ? 1 : 0;
    N2 = Math.floor(Math.ceil(result / constants.L2 / 0.5) * 0.5);
    Ln12 = (N2 * constants.L2) + (N1 * constants.L1);
    NL2 = N2 * constants.profileRows;
    NL1 = N1 * constants.profileRows;
    NZ = (N1 + N2 - 1) * constants.profileRows;
    Nmc = (N - 1) * 2;
    Ng = Math.ceil(((result / constants.supportDistance) + 1) * constants.profileRows);

    savedResults = {
      N,
      result,
      profileOption,
      N1,
      N2,
      Ln12,
      NL1,
      NL2,
      NZ,
      Nmc,
      Ng,
    };
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedProfileOption', profileOption);
      localStorage.setItem(`roofingResult_${profileOption}`, JSON.stringify(savedResults));
    }
  }, [profileOption, savedResults]);

  const handleNextpage = () => {
    if (currentIndex + visibleCount < availablePanels.length) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrevpage = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handlePanelSelect = (panel) => {
    if (panel.availability === 'Немає в наявності') {
      alert("Ця панель наразі недоступна.");
      return;
    }

    setSelectedPanel(panel);
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedPanel', JSON.stringify(panel));
    }

    const [height, width, thickness] = panel.size.split('x');
    setPanelHeight(height);
    setPanelWidth(width);
    setPanelThickness(thickness);
    setPanelPower(panel.power);
  };

  const handleNext = () => {
    const queryParams = {
      panelHeight,
      panelWidth,
      panelThickness,
      panelPower,
      selectedPanel: selectedPanel ? selectedPanel.id : null,
    };
    const formData = { panelHeight, panelWidth, panelThickness, panelPower };
    if (typeof window !== 'undefined') {
      localStorage.setItem('panelData', JSON.stringify(formData));
    }
    router.push({
      pathname: '/panel_type',
      query: queryParams,
    });
  };

  const handlePrev = () => {
    router.push('/autorization');
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userData');
      localStorage.removeItem('savedResults');
    }
    setUser(null);
    setIsAuthenticated(false);
    router.push('/');
  };

  return (
    <div className="bg-[#0C0E3A] text-white min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex flex-col items-center py-4">
        <h1 className="text-4xl font-bold">КАЛЬКУЛЯТОР КРІПЛЕННЯ</h1>
        <div className="flex justify-center mt-4 space-x-2">
          {[...Array(10).keys()].map((_, index) => (
            <div
              key={index}
              className={`w-8 h-8 border-2 rounded-full flex items-center justify-center ${
                index === 2
                  ? 'border-yellow-400 text-yellow-400'
                  : 'border-gray-400 text-gray-400'
              }`}
            >
              {index + 1}
            </div>
          ))}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-start px-8 space-y-8">
        {/* Editing Constants (Visible for Admin) */}
        {isAdmin && (
          <div className="bg-gray-800 p-6 rounded-lg mt-4 space-y-6 w-full max-w-md mx-auto">
            <h3 className="text-lg font-semibold">Редагування прийнятих значень (constants)</h3>
            <div className="space-y-4">
              {[
                {
                  label: 'Кількість рядів профілів',
                  value: constants.profileRows,
                  setter: setConstants,
                  key: 'profileRows',
                },
                {
                  label: 'Довжина для крайніх прижимів (м)',
                  value: constants.endClampReserve,
                  setter: setConstants,
                  key: 'endClampReserve',
                },
                {
                  label: 'Довжина для міжпанельного прижиму (м)',
                  value: constants.interModuleClampLength,
                  setter: setConstants,
                  key: 'interModuleClampLength',
                },
                {
                  label: 'Відстань між опорами (м)',
                  value: constants.supportDistance,
                  setter: setConstants,
                  key: 'supportDistance',
                },
                {
                  label: 'Довжина профілю L1 (м)',
                  value: constants.L1,
                  key: 'L1',
                },
                {
                  label: 'Довжина профілю L2 (м)',
                  value: constants.L2,
                  key: 'L2',
                },
              ].map(({ label, value, key }, index) => (
                <label key={index} className="block">
                  {label}:
                  <input
                    type="number"
                    value={value || ''}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      if (value > 0 || isNaN(value)) {
                        setConstants({ ...constants, [key]: value });
                      }
                    }}
                    className="w-full px-4 py-2 rounded bg-white text-black mt-2"
                  />
                </label>
              ))}
              <label className="block">
                Ширини панелей (м, через кому):
                <input
                  type="text"
                  value={panelWidthsInput}
                  onChange={handlePanelWidthsChange}
                  placeholder="наприклад: 1.098, 1.134, 1.303"
                  className="w-full px-4 py-2 rounded bg-white text-black mt-2"
                />
              </label>
            </div>
            <button
              onClick={saveConstants}
              className="mt-6 bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 w-full"
            >
              Зберегти значення
            </button>
          </div>
        )}

        {/* Panel Dimensions Section */}
        <div className="text-center w-full max-w-5xl mx-auto">
          <h2 className="text-2xl mb-4">РОЗМІРИ ПАНЕЛІ</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              {
                placeholder: 'Висота, мм',
                value: panelHeight,
                setter: setPanelHeight,
              },
              {
                placeholder: 'Ширина, мм',
                value: panelWidth,
                setter: setPanelWidth,
              },
              {
                placeholder: 'Товщина, мм',
                value: panelThickness,
                setter: setPanelThickness,
              },
            ].map(({ placeholder, value, setter }, index) => (
              <input
                key={index}
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => setter(e.target.value)}
                className="w-24 px-2 py-1 rounded bg-white text-black text-center text-sm"
              />
            ))}
            <label>Ширина панелі</label>
            <select
              value={B}
              onChange={(e) => setB(parseFloat(e.target.value))}
              className="text-center bg-white text-black px-4 py-2 rounded"
            >
              {(constants.panelWidths || []).map((value) => (
                <option key={value} value={value}>
                  {value} м
                </option>
              ))}
            </select>
            <label>Кількість панелей у ряді</label>
            <input
              type="number"
              min={1}
              value={N}
              onChange={(e) => setN(parseInt(e.target.value))}
              className="w-24 px-2 py-1 rounded bg-white text-black text-center text-sm"
            />
            <div className="text-center w-full max-w-md mx-auto my-6">
              <label className="block text-lg font-semibold mb-2">Довжини профілів</label>
              {constants.L1 && constants.L2 ? (
                <select
                  value={profileOption}
                  onChange={(e) => setProfileOption(e.target.value)}
                  className="w-full text-center bg-white text-black px-4 py-2 rounded border border-gray-300 shadow-sm"
                >
                  <option value="L1">Тільки {constants.L1} м</option>
                  <option value="L1_L2">{constants.L1} м та {constants.L2} м</option>
                </select>
              ) : (
                <p className="text-red-500">Довжини профілів не визначено</p>
              )}
            </div>
          </div>
        </div>

        {/* Panel Power Section */}
        <div className="text-center w-full max-w-md mx-auto">
          <h2 className="text-2xl mb-4">ПОТУЖНІСТЬ ПАНЕЛІ</h2>
          <input
            type="text"
            placeholder="Потужність Вт"
            value={panelPower}
            onChange={(e) => setPanelPower(e.target.value)}
            className="w-40 px-4 py-2 rounded bg-white text-black"
          />
        </div>

        {/* Panel Selection Section */}
        <div className="text-center w-full max-w-6xl mx-auto">
          <h2 className="text-2xl mb-4">ПІДІБРАТИ З НАЯВНИХ НА СКЛАДІ</h2>
          <div className="relative">
            <button
              onClick={handlePrevpage}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-yellow-400 text-black p-3 rounded-full shadow-lg hover:bg-yellow-500"
              disabled={currentIndex === 0}
            >
              <svg width="24" height="24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            <div className="border-2 border-white p-4 rounded-lg flex gap-4 overflow-x-auto justify-center items-center">
              {availablePanels
                .slice(currentIndex, currentIndex + visibleCount)
                .map((panel) => (
                  <div
                    key={panel.id}
                    className={`w-64 bg-gradient-to-r from-blue-500 to-purple-500 text-white p-6 rounded-lg shadow-xl transition-transform duration-300 hover:scale-105 ${
                      selectedPanel?.id === panel.id ? 'border-4 border-yellow-400' : ''
                    } ${
                      panel.availability === 'Немає в наявності'
                        ? 'opacity-50 cursor-not-allowed'
                        : ''
                    }`}
                    onClick={() => handlePanelSelect(panel)}
                    style={{
                      pointerEvents:
                        panel.availability === 'Немає в наявності' ? 'none' : 'auto',
                    }}
                  >
                    <p className="font-bold text-lg">{panel.manufacturer}</p>
                    <p className="text-sm mt-2">{panel.size}</p>
                    <p className="text-sm mt-2">{panel.power}</p>
                    <p
                      className={`font-semibold mt-2 text-sm ${
                        panel.availability === 'Немає в наявності'
                          ? 'text-red-500'
                          : 'text-green-500'
                      }`}
                    >
                      {panel.availability}
                    </p>
                  </div>
                ))}
            </div>

            <button
              onClick={handleNextpage}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-yellow-400 text-black p-3 rounded-full shadow-lg hover:bg-yellow-500"
              disabled={currentIndex + visibleCount >= availablePanels.length}
            >
              <svg width="24" height="24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>

        {result !== null && (
          <div className="w-full max-w-xl mx-auto mt-8 bg-white rounded-xl shadow-lg p-6 text-black">
            <h2 className="text-2xl font-bold text-center mb-6 text-blue-700">РЕЗУЛЬТАТИ РОЗРАХУНКІВ</h2>
            <div className="space-y-3 text-lg">
              <p>
                <span className="font-medium">Загальна довжина профілів:</span> {result} м
              </p>
              <p>
                <span className="font-medium">Кількість профілів L1 ({constants.L1} м):</span> {N1}
              </p>
              {profileOption === 'L1_L2' ? (
                <>
                  <p>
                    <span className="font-medium">Кількість профілів L2 ({constants.L2} м):</span> {N2}
                  </p>
                  <p>
                    <span className="font-medium">Загальна кількість профілів:</span> {NL1 + NL2}
                  </p>
                </>
              ) : (
                <p>
                  <span className="font-medium">Загальна кількість профілів:</span> {L1N}
chie                </p>
              )}
              <p>
                <span className="font-medium">Кількість зєднувачів (Nz):</span> {Nz}
              </p>
              <p>
                <span className="font-medium">Кількість міжпанельних прижимів (Nmc):</span> {Nmc}
              </p>
              <p>
                <span className="font-medium">Кількість опор (Ng):</span> {Ng}
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="flex justify-between items-center p-8 space-x-4">
        <button
          onClick={handlePrev}
          className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg"
        >
          НАЗАД
        </button>
        <button
          onClick={logout}
          className="bg-yellow-400 text-black px-6 py-3 rounded-lg"
        >
          ВИЙТИ
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