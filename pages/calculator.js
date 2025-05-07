import React, { useState, useEffect } from 'react';

export default function SolarMountCalculator() {
  const [formData, setFormData] = useState({
    objectName: '',
    profileMaterial: '',
    roofType: '',
    selectedProduct: null,
    numberOfRows: 1,
    panelsPerRow: 1,
    distanceFromRoofStart: 0,
    rowParameters: [],
    roofLength: 0, 
    roofHeight: 0, 
    distanceBetweenRafters: 0, 
    showStraps: false,
    showPressRed: false,
    showPressBlue: false,
    showTriangle: false,
    showProfileConnectors: false,
  });
  const [categories, setCategories] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [products, setProducts] = useState([]);
  const [showBonusPopup, setShowBonusPopup] = useState(false); 
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]); 
  const [specifications,generateSpecifications] = useState([]); 
  const [cart, setCart] = useState([]);
  const fetchCategories = async () => {
    try {
      const url =
        'https://asmos.hi-it.com.ua/wp-json/wc/v3/products/categories?consumer_key=ck_d4ae025596c46effa71d2d9c6c7a98de33777fc1&consumer_secret=cs_e853eca5c77ca8f5f9405ee1efa9dd8eeeed74df';
      const response = await fetch(url);
      const data = await response.json();
      setCategories(data);  // Оновлюємо стан категорій
      console.log(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Завантаження товарів по категорії
  const fetchProductsByCategorySlug = async (categorySlug) => {
    try {
      setLoading(true);
      console.log('Fetching products for category slug:', categorySlug);
  
      // Знайдемо ID категорії за slug
      const category = categories.find((cat) => cat.slug === categorySlug);
      if (!category) {
        console.error('Category not found!');
        return;
      }
      const categoryId = category.id;
      console.log('Category ID:', categoryId); // Лог для перевірки
  
      // Тепер передаємо ID категорії
      const url = `https://asmos.hi-it.com.ua/wp-json/wc/v3/products?category=${categoryId}&consumer_key=ck_d4ae025596c46effa71d2d9c6c7a98de33777fc1&consumer_secret=cs_e853eca5c77ca8f5f9405ee1efa9dd8eeeed74df`;
      const response = await fetch(url);
      const data = await response.json();
  
      console.log('Fetched data:', data);
  
      if (data.length === 0) {
        console.log('No products found for this category');
      }
  
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error('Error fetching products by category:', error);
    } finally {
      setLoading(false);
    }
  };


  // Handle changes in inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
      selectedProduct: null,
    }));
  
    if (name === 'profileMaterial' || name === 'roofType') {
      if (value === '') {
        setFilteredProducts(products); // Якщо не вибрано фільтр, показуємо всі товари
      } else {
        const categorySlug = name === 'profileMaterial' ? getCategorySlug(value) : getRoofCategorySlug(value);
        console.log('Selected category slug:', categorySlug); // Лог для перевірки slug
        fetchProductsByCategorySlug(categorySlug);
      }
    }
  };

  // Handle product selection
  const handleProductSelect = (productId) => {
    const product = filteredProducts.find(p => p.id === productId);
    if (product) {
      setCart((prevCart) => {
        const existingProduct = prevCart.find(p => p.id === productId);
        if (existingProduct) {
          // Якщо товар вже в кошику, збільшуємо кількість
          return prevCart.map((p) =>
            p.id === productId ? { ...p, quantity: p.quantity + 1 } : p
          );
        } else {
          // Якщо товар ще не в кошику, додаємо новий товар
          return [...prevCart, { ...product, quantity: 1 }];
        }
      });
    }
  };
    useEffect(() => {
    fetchCategories();
  }, []);
  const getCartTotal = () => {
    return cart.reduce((total, product) => total + product.quantity, 0);
  };
  const addToCart = (productId, quantity = 1) => {
    if (typeof window !== "undefined") {
        // Перевірка чи товар вже в кошику
        const existingProduct = selectedProducts.find((product) => product.id === productId);
        console.log(`Product ID: ${productId}, Quantity: ${quantity}`);

        if (existingProduct) {
            const updatedProducts = selectedProducts.map((product) =>
                product.id === productId
                    ? { ...product, quantity: product.quantity + quantity } // Оновлюємо кількість
                    : product
            );
            setSelectedProducts(updatedProducts);
        } else {
            const data = {
                action: 'woocommerce_add_to_cart',
                product_id: productId,
                quantity: quantity,
            };

            console.log("Sending data to cart:", data);

            fetch('https://asmos.hi-it.com.ua/?wc-ajax=add_to_cart', {
                method: 'POST',
                body: new URLSearchParams(data),
            })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                console.log('Response from server:', data);
                if (data && data.fragments) {
                    console.log('Товар додано до кошика:', data);

                    // Оновлення стану після затримки
                    setTimeout(() => {
                        setSelectedProducts((prevSelected) => {
                            const updatedSelected = prevSelected.filter(product => product.id !== productId);
                            return [...updatedSelected, { id: productId, quantity }];
                        });

                        // Оновлення фрагментів кошика
                        Object.keys(data.fragments).forEach(fragment => {
                            const element = document.querySelector(fragment);
                            if (element) {
                                console.log('Updating element:', fragment, 'with content:', data.fragments[fragment]);
                                element.innerHTML = data.fragments[fragment];
                            } else {
                                console.warn('Element not found for fragment:', fragment);
                            }
                        });
                    }, 1000); // Затримка в 1 секунду
                } else {
                    console.error('Не вдалося додати товар до кошика');
                }
            })
            .catch((error) => {
                console.error('Помилка при додаванні товару в кошик:', error);
            });
        }
    } else {
        console.error('Window object не доступний');
    }
};

  const showBonus = () => {
    setShowBonusPopup(true);
  };

  // Handle row parameter change (panels, distance)
  const handleRowParameterChange = (index, field, value) => {
    const updatedRowParams = [...formData.rowParameters];
    updatedRowParams[index] = {
      ...updatedRowParams[index],
      [field]: value,
    };
    setFormData((prevData) => ({
      ...prevData,
      rowParameters: updatedRowParams,
    }));
  };

  // Get category slug based on profile material
  const getCategorySlug = (profileMaterial) => {
    switch (profileMaterial) {
      case 'aluminum':
        return 'aluminum-profs';
      case 'coldZinc':
        return 'zinc-steel-profs';
      case 'hotZinc':
        return 'zinc-steel-profs';
      default:
        return '';
    }
  };

  // Get category slug based on roof type
  const getRoofCategorySlug = (roofType) => {
    switch (roofType) {
      case 'flat':
        return 'metal-roof'; // Баластні системи кріплень
      case 'pitched':
        return 'p-roof'; // Система кріплення з анкеруванням
      default:
        return '';
    }
  };

  // Calculate total price of selected products (with panels and mounting costs)

  return (
<div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4">Калькулятор для монтажу сонячних панелей</h1>
 {/* Спливаючий кружок */}
 {isDemoMode && (
        <div
          className="fixed bottom-10 right-10 p-4 bg-green-500 text-white rounded-full cursor-pointer shadow-lg"
          onClick={showBonus}
        >
          Бонуси за реєстрацію!
        </div>
      )}

      {/* Повідомлення з бонусами */}
      {showBonusPopup && (
        <div className="fixed top-1/4 left-1/2 transform -translate-x-1/2 bg-white shadow-lg p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Отримайте бонуси за реєстрацію!</h2>
          <p>Зареєструйтесь на сайті, щоб отримати ексклюзивні пропозиції та знижки на ваші покупки!</p>
          <button
            onClick={() => setShowBonusPopup(false)}
            className="mt-4 bg-blue-500 text-white p-2 rounded"
          >
            Закрити
          </button>
        </div>
      )}
      <div className="mb-4">
        {!isLoggedIn && !isDemoMode ? (
          <>
            <button
              onClick={() => setIsDemoMode(true)}
              className="px-4 py-2 bg-green-500 text-white rounded mb-4"
            >
              Демо-розрахунок
            </button>
            <button
              onClick={() => setIsLoggedIn(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Зареєструватися/Увійти
            </button>
          </>
        ) : (
          <form className="grid grid-cols-1 gap-4 mb-6">
            <div>
              <label>Тип профілю:</label>
              <select
                name="profileMaterial"
                value={formData.profileMaterial}
                onChange={handleChange}
                className="border p-2 w-full"
              >
                <option value="">Оберіть</option>
                <option value="aluminum">Алюміній</option>
                <option value="coldZinc">Холодний цинк</option>
                <option value="hotZinc">Гарячий цинк</option>
              </select>
            </div>
            <div>
            <div>
      <h3>Товари</h3>
      {loading ? (
        <p>Завантаження...</p>
      ) : (
        <div>
         {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {filteredProducts.map((product) => (
                <div key={product.id} className="border p-4">
                  <h4>{product.name}</h4>
                  <p>{product.price} грн</p>
                  <button
                    onClick={() => handleProductSelect(product.id)}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    Додати в кошик
                  </button>
                  <button
  onClick={(e) => {
    e.preventDefault(); // Запобігання оновленню сторінки
    addToCart(product.id, 1);
  }}
  className="btn-add-to-cart"
>                    Додати в кошик (1)
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p>Товари не знайдено.</p>
          )}
        </div>
      )}
    </div>

  </div>
           

            <div>
              <label>Тип покрівлі:</label>
              <select
                name="roofType"
                value={formData.roofType}
                onChange={handleChange}
                className="border p-2 w-full"
              >
                <option value="">Оберіть тип покрівлі</option>
                <option value="pitched">Похила</option>
                <option value="flat">Плоска</option>
              </select>
            </div>
            <div>
              <label>Довжина покрівлі (м):</label>
              <input
                type="number"
                name="roofLength"
                value={formData.roofLength}
                onChange={handleChange}
                className="border p-2 w-full"
              />
            </div>

            <div>
              <label>Висота покрівлі (м):</label>
              <input
                type="number"
                name="roofHeight"
                value={formData.roofHeight}
                onChange={handleChange}
                className="border p-2 w-full"
              />
            </div>

            <div>
              <label>Відстань між кроквами (м):</label>
              <input
                type="number"
                name="distanceBetweenRafters"
                value={formData.distanceBetweenRafters}
                onChange={handleChange}
                className="border p-2 w-full"
              />
            </div>
            {formData.roofType && (
              <div>
                <label>Покриття:</label>
                <select
                  name="roofCovering"
                  value={formData.roofCovering}
                  onChange={handleChange}
                  className="border p-2 w-full"
                >
                  <option value="">Оберіть покриття</option>
                  {formData.roofType === 'pitched' && (
                    <>
                      <option value="ceramic">Керамічна</option>
                      <option value="metalTile">Металочерепиця</option>
                      <option value="profileSheet">Профлист</option>
                      <option value="bitumen">Бітумна</option>
                    </>
                  )}
                  {formData.roofType === 'flat' && (
                    <>
                      <option value="ruberoid">Руберойд по бетону</option>
                      <option value="membrane">Мембрана по утеплювачу</option>
                      <option value="sandwich">Сендвіч</option>
                      <option value="flatProfileSheet">Профлист</option>
                    </>
                  )}
                </select>
              </div>
            )}
 <div>
              <label>Кількість рядів:</label>
              <input
                type="number"
                name="numberOfRows"
                value={formData.numberOfRows}
                onChange={(e) => setFormData({ ...formData, numberOfRows: e.target.value })}
                className="border p-2 w-full"
              />
            </div>
            {Array.from({ length: formData.numberOfRows }).map((_, index) => (
              <div key={index} className="mb-4">
                <h3>Ряд {index + 1}</h3>
                <div>
                  <label>Кількість панелей в ряді:</label>
                  <input
                    type="number"
                    value={formData.rowParameters[index]?.panels || 1}
                    onChange={(e) =>
                      handleRowParameterChange(index, 'panels', e.target.value)
                    }
                    className="border p-2 w-full"
                  />
                </div>
                <div>
                  <label>Відстань від початку кровлі (м):</label>
                  <input
                    type="number"
                    value={formData.rowParameters[index]?.distance || 0}
                    onChange={(e) =>
                      handleRowParameterChange(index, 'distance', e.target.value)
                    }
                    className="border p-2 w-full"
                  />
                  <div>
                <label>Орієнтація панелей:</label>
                <select
                  value={formData.rowParameters[index]?.orientation || 'landscape'}
                  onChange={(e) =>
                    handleRowParameterChange(index, 'orientation', e.target.value)
                  }
                  className="border p-2 w-full"
                >
                  <option value="landscape">Альбомна</option>
                  <option value="portrait">Книжкова</option>
                </select>
              </div>
                </div>
              </div>
            ))}
          </form>
        )}
      </div>
      <div className="mb-4">
      <button
      onClick={generateSpecifications}
      className="px-4 py-2 bg-green-500 text-white rounded mb-4"
    >
      Генерувати специфікації
    </button>
  </div>
      <div className="border p-4 mb-4">
  <h2 className="font-semibold">Специфікація:</h2>
  {specifications.length > 0 ? (
    <table className="w-full">
      <thead>
        <tr>
          <th className="text-right">Ряд</th>
          <th className="text-right">Кількість панелей</th>
        </tr>
      </thead>
      <tbody>
        {specifications.map((spec, index) => (
          <tr key={index}>
            <td className="text-right">{spec.row}</td>
            <td className="text-right">{spec.panels }</td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <p>Ще немає специфікацій.</p>
  )}

</div>

      {/* Display products */}
    
<div>
  <h2>Обрані продукти:</h2>
  {cart.length > 0 ? (
    cart.map((product, index) => (
      <div key={index}>
        <h3>{product.name}</h3>
        <p>Ціна: {product.price} грн</p>
      </div>
    ))
  ) : (
    <p>Кошик порожній</p>
  )}
  <p>Кількість: {getCartTotal()}</p>
</div>
      {/* Visualize panels and rows */}
      {formData.numberOfRows > 0 && (
<div id="panel-visualization">
  <div className="mt-6">
    <h2 className="text-lg font-bold">Візуалізація монтажу</h2>
    <svg
      width="100%"
      height={50 + (formData.numberOfRows * (formData.rowParameters.reduce((maxHeight, row) => {
        const panelHeight = row.orientation === 'portrait' ? 200 : 100;
        return Math.max(maxHeight, panelHeight + 20);
      }, 0)))}
      className="border border-gray-300 mt-4"
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${200 + (formData.rowParameters.reduce((maxPanels, row) => Math.max(maxPanels, row.panels || 1), 1) * 220)} ${50 + formData.numberOfRows * 200}`}
    >
      {/* Render rows with panels */}
      {formData.rowParameters.map((row, rowIndex) => {
        const yPosition = 50 + rowIndex * (200 + 20);
        const panelWidth = 220; // Width of one panel
        const distanceBetweenPanels = 20; // Distance between panels
        const totalRowLength = row.panels * panelWidth + (row.panels - 1) * distanceBetweenPanels; // Total row length

        const firstPanelX = 50;
        const lastPanelX = firstPanelX + (row.panels - 1) * (panelWidth + distanceBetweenPanels);
        const middlePanelX = firstPanelX + (row.panels / 2) * (panelWidth + distanceBetweenPanels);

        return (
          <g key={rowIndex}>
            {/* Draw panels */}
            {Array.from({ length: row.panels }).map((_, panelIndex) => {
              const xPosition = firstPanelX + panelIndex * (panelWidth + distanceBetweenPanels);
              return (
                <rect
                  key={panelIndex}
                  x={xPosition}
                  y={yPosition}
                  width={panelWidth}
                  height={100}
                  fill="lightblue"
                  stroke="blue"
                />
              );
            })}

            {/* Стропила: три вертикальні лінії */}
            {formData.showStraps && (
              <g>
                <line x1={firstPanelX} y1={yPosition} x2={firstPanelX} y2={yPosition + 200} stroke="black" strokeWidth="2" />
                <line x1={middlePanelX} y1={yPosition} x2={middlePanelX} y2={yPosition + 200} stroke="black" strokeWidth="2" />
                <line x1={lastPanelX} y1={yPosition} x2={lastPanelX} y2={yPosition + 200} stroke="black" strokeWidth="2" />
              </g>
            )}

            {/* Add labels for row length and distances */}
            <text x={50} y={yPosition - 10} fontSize="14" fill="black">Ряд {rowIndex + 1}</text>
            <text x={50} y={yPosition + 120} fontSize="12" fill="black">Довжина: {totalRowLength} м</text>

            {/* Distance markers between panels */}
            {Array.from({ length: row.panels - 1 }).map((_, panelIndex) => {
              const xPosition = 50 + (panelIndex + 1) * (panelWidth + distanceBetweenPanels) - distanceBetweenPanels / 2;
              return (
                <line
                  key={panelIndex}
                  x1={xPosition}
                  y1={yPosition + 50}
                  x2={xPosition}
                  y2={yPosition + 150}
                  stroke="black"
                  strokeWidth="1"
                />
              );
            })}

            {/* Прижими Z на початку та в кінці ряду */}
            {formData.showPressRed && (
              <g>
                <circle cx={50} cy={yPosition + 100} r="10" fill="red" />
                <circle cx={50 + (row.panels - 1) * (panelWidth + distanceBetweenPanels)} cy={yPosition + 100} r="10" fill="red" />
              </g>
            )}

            {/* Прижими V між панелями на профілях */}
            {formData.showPressBlue && (
              Array.from({ length: row.panels - 1 }).map((_, panelIndex) => {
                const xPosition = 50 + (panelIndex + 1) * (panelWidth + distanceBetweenPanels) - distanceBetweenPanels / 2;
                return (
                  <polygon
                    key={panelIndex}
                    points={`${xPosition + panelWidth / 2},${yPosition + 50} ${xPosition + panelWidth / 2 + 20},${yPosition + 70} ${xPosition + panelWidth / 2},${yPosition + 90}`}
                    fill="blue"
                  />
                );
              })
            )}

            {/* Кріплення в кровлю поверх стропил */}
            {formData.showTriangle && row.panels > 1 && (
              Array.from({ length: row.panels }).map((_, panelIndex) => {
                const xPosition = 50 + panelIndex * (panelWidth + distanceBetweenPanels);
                return (
                  <polygon
                    key={panelIndex}
                    points={`${xPosition + panelWidth / 2},${yPosition + 50} ${xPosition + panelWidth / 2 + 20},${yPosition + 80} ${xPosition + panelWidth / 2},${yPosition + 110}`}
                    fill="green"
                  />
                );
              })
            )}

            {/* З'єднувачі профілів між панелями */}
            {formData.showProfileConnectors && row.panels > 1 && (
              Array.from({ length: row.panels - 1 }).map((_, panelIndex) => {
                const xPosition = 50 + (panelIndex + 1) * (panelWidth + distanceBetweenPanels) - distanceBetweenPanels / 2;
                return (
                  <line
                    key={panelIndex}
                    x1={xPosition}
                    y1={yPosition + 50}
                    x2={xPosition}
                    y2={yPosition + 150}
                    stroke="grey"
                    strokeWidth="1"
                  />
                );
              })
            )}
          </g>
        );
      })}
    </svg>
  </div>
  </div>
)}

<div className="mb-4">
  <label className="flex items-center">
    <input
      type="checkbox"
      onChange={(e) => setFormData({ ...formData, showStraps: e.target.checked })}
      checked={formData.showStraps}
      className="mr-2"
    />
    Стропила
  </label>

  <label className="flex items-center">
    <input
      type="checkbox"
      onChange={(e) => setFormData({ ...formData, showPressRed: e.target.checked })}
      checked={formData.showPressRed}
      className="mr-2"
    />
    Прижими Z
  </label>

  <label className="flex items-center">
    <input
      type="checkbox"
      onChange={(e) => setFormData({ ...formData, showPressBlue: e.target.checked })}
      checked={formData.showPressBlue}
      className="mr-2"
    />
    Прижими V
  </label>

  <label className="flex items-center">
    <input
      type="checkbox"
      onChange={(e) => setFormData({ ...formData, showTriangle: e.target.checked })}
      checked={formData.showTriangle}
      className="mr-2"
    />
    Кріплення в кровлю
  </label>

  <label className="flex items-center">
    <input
      type="checkbox"
      onChange={(e) => setFormData({ ...formData, showProfileConnectors: e.target.checked })}
      checked={formData.showProfileConnectors}
      className="mr-2"
    />
    Профілі
  </label>
</div>

</div>
  );
}
