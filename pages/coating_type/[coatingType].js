import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function CoverTypeSelection() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState("");
  const [coverTypes, setCoverTypes] = useState([]);
  const [fasteningSystems, setFasteningSystems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { coatingType } = router.query;
  // Отримання даних з API
  useEffect(() => {
    const fetchCoverTypes = async () => {
      try {
        const response = await fetch(
          "https://asmos.hi-it.com.ua/wp-json/wc/v3/products/categories?consumer_key=ck_d4ae025596c46effa71d2d9c6c7a98de33777fc1&consumer_secret=cs_e853eca5c77ca8f5f9405ee1efa9dd8eeeed74df"
        );
    
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        const data = await response.json();
        console.log("Отримані типи покриттів:", data); 
        setCoverTypes(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Помилка при отриманні даних:", error);
        setIsLoading(false);
      }
    };

    fetchCoverTypes();
  }, []); 
  useEffect(() => {
    const fetchCoverTypes = async () => {
      try {
        const response = await fetch('/api/fetchCategories');
        const data = await response.json();
        console.log("Отримані типи покриттів:", data); 
        setCoverTypes(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Помилка при отриманні даних:", error);
        setIsLoading(false);
      }
    };

    fetchCoverTypes();
  }, []); 
  useEffect(() => {
    if (router.isReady) {

      console.log("coatingType з query:", coatingType); 
  
      if (coatingType && coverTypes.length > 0) {
        let filteredSystems = [];
  
        switch (coatingType) {
          case "flat":
            filteredSystems = coverTypes.filter(type =>
              ["south-kits", "%d0%b2%d1%81%d1%96-%d1%82%d0%be%d0%b2%d0%b0%d1%80%d0%b8"].includes(type.slug)
            );
            break;
          case "pitched":
            filteredSystems = coverTypes.filter(type =>
              ["metal-roof", "natural-tiles", "bitum-tiles", "steel-sheet"].includes(type.slug)
            );
            break;
          default:
            filteredSystems = [];
        }
  
        console.log("Filtered fastening systems:", filteredSystems); 
        setFasteningSystems(filteredSystems);
      }
    }
  }, [router.isReady, router.query, coverTypes]); 


  if (!router.isReady || isLoading) {
    return <div>Завантаження...</div>;
  }

  const handleNext = () => {
    console.log("selectedType:", selectedType); 
    if (selectedType) {
      const formData = { selectedType };
      localStorage.setItem('coatingType', JSON.stringify(formData));
      const nextRoute = `/profile_type/${selectedType}`;
      console.log("Маршрут для перенаправлення:", nextRoute);
      router.push(nextRoute); 
    } else {
      alert("Оберіть тип покриття!");
    }
  };
  
  return (
    <div className="flex flex-col h-screen bg-[#0C0E3A] text-white">
      <header className="flex flex-col items-center mt-4">
        <h1 className="text-3xl font-bold">КАЛЬКУЛЯТОР КРІПЛЕННЯ</h1>
        <div className="flex justify-center mt-4 space-x-2">
          {[...Array(10)].map((_, index) => (
            <div
              key={index}
              className={`w-8 h-8 border-2 rounded-full flex items-center justify-center ${index === 4 ? "border-yellow-400 text-yellow-400" : "border-gray-400 text-gray-400"}`}
            >
              {index + 1}
            </div>
          ))}
        </div>
      </header>
      <div className="flex-grow flex items-center justify-center">
        <div className="grid grid-cols-4 gap-8 w-full max-w-4xl p-8">
          {fasteningSystems.length > 0 ? (
            fasteningSystems.map((system) => (
              <div key={system.slug} className="flex flex-col items-center">
                <div
                  className={`w-24 h-24 bg-gray-300 rounded-lg ${selectedType === system.slug ? "border-4 border-yellow-400" : ""}`}
                  onClick={() => setSelectedType(system.slug)}
                />
                <label className="mt-2 text-center">
                  <input
                    type="checkbox"
                    checked={selectedType === system.slug}
                    onChange={() => setSelectedType(system.slug)}
                    className="hidden"
                  />
                  {system.name}
                </label>
              </div>
            ))
          ) : (
            <div>Немає доступних товарів для цього типу покриття</div>
          )}
        </div>
      </div>

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
