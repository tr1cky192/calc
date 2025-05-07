import { useEffect, useState } from 'react';

export default function SavedDataPage() {
  const [savedData, setSavedData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [retrievedResults, setRetrievedResults] = useState(null);
  const [gridSize, setGridSize] = useState({ columns: 10, rows: 6 });
  const CELL_SIZE = 50;
  const SUBDIVISION_COUNT = 10;
  const [profileOption, setProfileOption] = useState();
  const SUBDIVISION_SIZE = CELL_SIZE / SUBDIVISION_COUNT;
  const [symbolVisibility, setSymbolVisibility] = useState({
    circle: true,
    triangle: true,
    square: true,
    rail: true,
  });
  const [panels, setPanels] = useState([]);

  const preparePanelsData = (rows, calculationResults) => {
    const preparedPanels = [];
    const rowSpacing = 0.2;
    const panelSpacing = 0.2;
    const railOffset = 0.1; // Small offset from start/end of each rail
    let currentY = 0;

    rows.forEach((row) => {
      const orientation = row.orientation || 'vertical';
      const count = parseInt(row.count) || 0;
      let maxHeight = 0;

      for (let i = 0; i < count; i++) {
        const panel = {
          x: i * (orientation === 'horizontal' ? 2 + panelSpacing : 1 + panelSpacing),
          y: currentY,
          width: orientation === 'horizontal' ? 2 : 1,
          height: orientation === 'horizontal' ? 1 : 2,
          symbols: [],
        };

        if (calculationResults) {
          // З'єднувачі (Nz) між панелями
          if (i < count - 1 && i < calculationResults.Nz) {
            panel.symbols.push({
              type: 'circle',
              color: 'green',
              offsetX: panel.width + panelSpacing / 2,
              offsetY: 0.5,
            });
          }
          // Міжпанельні прижими (Nmc) між панелями
          if (i < count - 1 && i < calculationResults.Nmc) {
            panel.symbols.push({
              type: 'triangle',
              color: 'red',
              offsetX: panel.width + panelSpacing / 2,
              offsetY: 1,
            });
          }
          // Опор (Ng) під панелями
          if (i < calculationResults.Ng) {
            panel.symbols.push({
              type: 'square',
              color: 'blue',
              offsetX: panel.width / 2,
              offsetY: panel.height + 0.2,
            });
          }
          // Профілі: два зверху, два знизу
          // Верхні профілі
          panel.symbols.push({
            type: 'rail',
            color: 'orange',
            offsetX: railOffset, // Зсув від початку
            offsetY: -0.2, // Над панеллю
            width: (panel.width / 2) - railOffset, // Половина ширини з відступом
          });
          panel.symbols.push({
            type: 'rail',
            color: 'orange',
            offsetX: panel.width / 2, // Друга половина
            offsetY: -0.2, // Над панеллю
            width: (panel.width / 2) - railOffset, // Половина ширини з відступом
          });
          // Нижні профілі
          panel.symbols.push({
            type: 'rail',
            color: 'orange',
            offsetX: railOffset, // Зсув від початку
            offsetY: panel.height + 0.2, // Під панеллю
            width: (panel.width / 2) - railOffset, // Половина ширини з відступом
          });
          panel.symbols.push({
            type: 'rail',
            color: 'orange',
            offsetX: panel.width / 2, // Друга половина
            offsetY: panel.height + 0.2, // Під панеллю
            width: (panel.width / 2) - railOffset, // Половина ширини з відступом
          });
        }

        maxHeight = Math.max(maxHeight, panel.height);
        preparedPanels.push(panel);
      }

      currentY += maxHeight + rowSpacing;
    });

    return preparedPanels;
  };

  const updateGridSize = (panels) => {
    let maxX = 0;
    let maxY = 0;

    panels.forEach((panel) => {
      const panelRightEdge = panel.x + panel.width;
      const panelBottomEdge = panel.y + panel.height + 0.4; // Account for rails above and below
      if (panelRightEdge > maxX) maxX = panelRightEdge;
      if (panelBottomEdge > maxY) maxY = panelBottomEdge;
    });

    setGridSize({
      columns: Math.ceil(maxX) + 1,
      rows: Math.ceil(maxY) + 1,
    });
  };

  useEffect(() => {
    const savedRows = JSON.parse(localStorage.getItem('rowsData')) || [];
    const savedResults = JSON.parse(localStorage.getItem('roofingCalculationResults')) || null;
    setRetrievedResults(savedResults);
    const preparedPanels = preparePanelsData(savedRows, savedResults);
    setPanels(preparedPanels);
    updateGridSize(preparedPanels);
  }, []);

  const renderGridWithScales = () => {
    const gridElements = [];
    const scaleLines = [];

    // Горизонтальні лінії та поділки зліва
    for (let y = 0; y <= gridSize.rows * CELL_SIZE; y += CELL_SIZE) {
      gridElements.push(
        <line
          key={`h-line-${y}`}
          x1={0}
          y1={y}
          x2={gridSize.columns * CELL_SIZE}
          y2={y}
          stroke="#ccc"
          strokeWidth="1"
        />
      );
      scaleLines.push(
        <text
          key={`y-label-${y}`}
          x={-30}
          y={y + 4}
          fontSize="10"
          textAnchor="end"
          fill="#000"
        >
          {(y / CELL_SIZE).toFixed(0)}
        </text>
      );

      for (let sub = 1; sub < SUBDIVISION_COUNT; sub++) {
        const subY = y + sub * SUBDIVISION_SIZE;
        if (subY < gridSize.rows * CELL_SIZE) {
          scaleLines.push(
            <line
              key={`h-sub-${y}-${sub}`}
              x1={-10}
              y1={subY}
              x2={0}
              y2={subY}
              stroke="#ccc"
              strokeWidth="0.5"
            />
          );
        }
      }
    }

    // Вертикальні лінії та поділки зверху
    for (let x = 0; x <= gridSize.columns * CELL_SIZE; x += CELL_SIZE) {
      gridElements.push(
        <line
          key={`v-line-${x}`}
          x1={x}
          y1={0}
          x2={x}
          y2={gridSize.rows * CELL_SIZE}
          stroke="#ccc"
          strokeWidth="1"
        />
      );
      scaleLines.push(
        <text
          key={`x-label-${x}`}
          x={x}
          y={-15}
          fontSize="10"
          textAnchor="middle"
          fill="#000"
        >
          {(x / CELL_SIZE).toFixed(0)}
        </text>
      );

      for (let sub = 1; sub < SUBDIVISION_COUNT; sub++) {
        const subX = x + sub * SUBDIVISION_SIZE;
        if (subX < gridSize.columns * CELL_SIZE) {
          scaleLines.push(
            <line
              key={`v-sub-${x}-${sub}`}
              x1={subX}
              y1={-10}
              x2={subX}
              y2={0}
              stroke="#ccc"
              strokeWidth="0.5"
            />
          );
        }
      }
    }

    return (
      <>
        {gridElements}
        {scaleLines}
      </>
    );
  };

  const renderPanels = () => {
    return panels.map((panel, index) => {
      const x = panel.x * CELL_SIZE;
      const y = panel.y * CELL_SIZE;
      const width = panel.width * CELL_SIZE;
      const height = panel.height * CELL_SIZE;

      return (
        <rect
          key={`panel-${index}`}
          x={x}
          y={y}
          width={width}
          height={height}
          fill="rgba(100, 100, 255, 0.5)"
          stroke="#000"
          strokeWidth="1"
        />
      );
    });
  };

  const renderSymbols = () => {
    return panels.flatMap((panel, panelIndex) => {
      return panel.symbols.map((symbol, symbolIndex) => {
        if (!symbolVisibility[symbol.type]) return null;
  
        const x = (panel.x + symbol.offsetX) * CELL_SIZE;
        const y = (panel.y + symbol.offsetY) * CELL_SIZE;
        const color = symbol.color || 'black';
  
        switch (symbol.type) {
          case 'circle':
            return (
              <circle
                key={`circle-${panelIndex}-${symbolIndex}`}
                cx={x}
                cy={y}
                r={5}
                fill={color}
              />
            );
          case 'triangle':
            return (
              <polygon
                key={`triangle-${panelIndex}-${symbolIndex}`}
                points={`${x},${y - 5} ${x - 5},${y + 5} ${x + 5},${y + 5}`}
                fill={color}
              />
            );
          case 'square':
            return (
              <rect
                key={`square-${panelIndex}-${symbolIndex}`}
                x={x - 4}
                y={y - 4}
                width={8}
                height={8}
                fill={color}
              />
            );
          case 'rail':
            return (
              <rect
                key={`rail-${panelIndex}-${symbolIndex}`}
                x={x}
                y={y}
                width={(symbol.width || 0.4) * CELL_SIZE}
                height={4}
                fill={color}
              />
            );
          default:
            return null;
        }
      });
    });
  };

  const renderRafterLines = () => {
    return panels.map((panel, index) => {
      const x1 = panel.x * CELL_SIZE;
      const y1 = panel.y * CELL_SIZE + CELL_SIZE / 4;
      const x2 = x1 + panel.width * CELL_SIZE;
      const y2 = y1;

      return (
        <line
          key={`rafter-${index}`}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="orange"
          strokeWidth="2"
        />
      );
    });
  };

  const getFirstWord = (str) => {
    return str?.split('_')[0] || str;
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/fetchCategories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/fetchProducts');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const filterCategoriesForProfile = (profileType) => {
    const profileSlug = getFirstWord(profileType)?.toLowerCase();
    return categories.filter((category) =>
      category.slug?.toLowerCase().startsWith(profileSlug)
    );
  };

  const filterCategoriesForCoating = (coatingType) => {
    return categories.filter((category) =>
      category.slug?.toLowerCase() === coatingType?.toLowerCase()
    );
  };

  const translatePanelType = (mountingType) => {
    const panelTranslations = {
      flat: 'Плоский',
      pitched: 'П своєму',
    };
    return panelTranslations[mountingType] || mountingType;
  };

  const mountingType = (panelType) => {
    const panelTranslations = {
      embedded_pin: 'Закладна шпилька',
      anchors: 'Анкери',
      geoscrews: 'Геошурупи',
    };
    return panelTranslations[panelType] || panelType;
  };

  useEffect(() => {
    const allResults = {};
    let selectedResult = null;
  
    // Отримуємо вибір профілю з localStorage
    const storedProfileOption = localStorage.getItem('selectedProfileOption') || 'L1';  // За замовчуванням 'L1'
  
    // Логування всіх елементів у localStorage, щоб побачити, що зберігається
    console.log('All items in localStorage:');
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = localStorage.getItem(key);
      console.log(key, value);  // Логуємо кожен ключ і його значення
    }
  
    // Проходимо по localStorage і збираємо відповідні результати
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('roofingResult_')) {
        const result = JSON.parse(localStorage.getItem(key));
  
        // Зберігаємо всі результати в об'єкт
        allResults[key] = result;
  
        // Перевіряємо, чи профіль в результаті збігається з вибраним
        if (result.profileOption === storedProfileOption) {
          selectedResult = result;  // Якщо збігається, вибираємо цей результат
        }
      }
    }
  
    // Встановлюємо результати для відображення
    setRetrievedResults(selectedResult || allResults);  // Якщо знайдено результат для вибраного профілю, відобразимо його; якщо ні - всі
  }, []); // Завантаження при ініціалізації компонента

  useEffect(() => {
    
    const data = [
      { name: 'Висота панелі', value: JSON.parse(localStorage.getItem('panelData'))?.panelHeight || 'Немає даних' },
      { name: 'Ширина панелі', value: JSON.parse(localStorage.getItem('panelData'))?.panelWidth || 'Немає даних' },
      { name: 'Товщина панелі', value: JSON.parse(localStorage.getItem('panelData'))?.panelThickness || 'Немає даних' },
      { name: 'Потужність панелі', value: JSON.parse(localStorage.getItem('panelData'))?.panelPower || 'Немає даних' },
      { name: 'Тип покриття', value: translatePanelType(JSON.parse(localStorage.getItem('panelType'))?.selectedType) || 'Немає даних' },
      { name: 'Тип профілю', value: JSON.parse(localStorage.getItem('profileType'))?.selectedProfile || 'Немає даних' },
      { name: 'Тип покриття', value: getFirstWord(JSON.parse(localStorage.getItem('coatingType'))?.selectedType) || 'Немає даних' },
      { name: 'Назва об`єкту', value: JSON.parse(localStorage.getItem('calculatorData'))?.objectName || 'Немає даних' },
      { name: 'Регіон', value: JSON.parse(localStorage.getItem('calculatorData'))?.region || 'Немає даних' },
      { name: 'Тип кріплення', value: mountingType(JSON.parse(localStorage.getItem('mountingType'))?.selectedMounting) || 'Немає даних' },
    ];

    setSavedData(data);
    fetchCategories();
    fetchProducts();
  }, []);

  return (
    <div className="bg-[#0C0E3A] text-white min-h-screen flex flex-col items-center">
      <header className="py-4">
        <h1 className="text-4xl font-bold text-center">ЗБЕРЕЖЕНІ ДАНІ</h1>
      </header>
      <main className="flex-1 flex flex-col items-center px-10 space-y-8 w-full">
        <svg
  width={gridSize.columns * CELL_SIZE}
  height={gridSize.rows * CELL_SIZE}
  style={{ margin: '40px', backgroundColor: '#fdfdfd' }}
>
  <g transform="translate(40, 40)">
    {renderGridWithScales()}
    {renderPanels()}
    {renderSymbols()}
  </g>
</svg>
        {savedData.map((item, index) => {
          let filteredCategories = [];

          if (item.name === 'Висота панелі' || item.name === 'Ширина панелі' || item.name === 'Товщина панелі') {
            const selectedPanel = JSON.parse(localStorage.getItem('selectedPanel'));
            if (selectedPanel) {
              item.value = `${selectedPanel.size.split('x')[0]} мм`;
            }
          }

          if (item.name === 'Тип профілю') {
            filteredCategories = filterCategoriesForProfile(item.value);
          }

          if (item.name === 'Тип покриття') {
            filteredCategories = filterCategoriesForCoating(item.value);
          }

          return (
            <div key={index} className="bg-white text-black p-4 rounded-lg shadow-lg w-full max-w-2xl flex flex-col">
              <span className="font-semibold">{item.name}:</span>
              {filteredCategories.length === 0 ? (
                <span className="text-right">
                  {typeof item.value === 'object' ? (
                    <pre className="text-sm">{JSON.stringify(item.value, null, 2)}</pre>
                  ) : (
                    item.value
                  )}
                </span>
              ) : (
                <div className="text-right">
                  <ul>
                    {filteredCategories.map((category) => (
                      <li key={category.id}>{category.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
<div className="bg-white text-black p-4 rounded-lg shadow-lg w-full max-w-2xl flex flex-col">
  {retrievedResults && (
    <div>
 <h2>Результати розрахунку покрівлі</h2>
          <p><strong>Довжина ряду панелей:</strong> {retrievedResults.result}</p>
          <p><strong>Профіль:</strong> {retrievedResults.profileOption}</p>
          <p><strong>Кількість профілів у одному ряді:</strong> {retrievedResults.N1}</p>
          <p><strong>Довжина одного ряду профілів під панель:</strong> {retrievedResults.Ln1}</p>
          <p><strong>Кількість профілів під рядом панелей:</strong> {retrievedResults.L1N}</p>
          <p><strong>Кількість з'єднювачів профілю:</strong> {retrievedResults.Nz}</p>
          <p><strong>Кількість комплектів міжмодульних притисків:</strong> {retrievedResults.Nmc}</p>
          <p><strong>Кількість опор під профілем для ряду панелей:</strong> {retrievedResults.Ng}</p>
    </div>
  )}
</div>
      </main>
      <footer className="flex justify-center items-center p-8"></footer>
    </div>
  );
}