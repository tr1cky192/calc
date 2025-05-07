import { useRouter } from "next/router";
import { useState } from "react"
export default function ProfileSelection() {
  const router = useRouter();
  const [selectedProfile, setSelectedProfile] = useState("");

  const handleNext = () => {
    if (selectedProfile) {
      const formData = { selectedProfile };
      localStorage.setItem('profileType', JSON.stringify(formData));
      router.push('/mounting_panel');
    } else {
      alert('Оберіть тип профілю!');
    }
  };
  

  const profileOptions = [
    {
      label: "АЛЮМІНІЄВИЙ",
      subOptions: [
        { label: "АНОДОВАНИЙ", value: "aluminum_anodized" },
        { label: "НЕ АНОДОВАНИЙ", value: "aluminum_non_anodized" },
      ],
    },
    {
      label: "СТАЛЕВИЙ",
      subOptions: [
        { label: "ХОЛОДНОЦИНКОВАНИЙ", value: "zinc-steel-profs" },
        { label: "ГАРЯЧЕЦИНКОВАНИЙ", value: "zinc-profs" },
      ],
    },
  ];

  return (
    <div className="flex flex-col h-screen bg-[#0C0E3A] text-white">
      <header className="flex flex-col items-center mt-4">
        <h1 className="text-3xl font-bold">КАЛЬКУЛЯТОР КРІПЛЕННЯ</h1>
        <div className="flex justify-center mt-4 space-x-2">
          {[...Array(10)].map((_, index) => (
            <div
              key={index}
              className={`w-8 h-8 border-2 rounded-full flex items-center justify-center ${
                index === 5
                  ? "border-yellow-400 text-yellow-400"
                  : "border-gray-400 text-gray-400"
              }`}
            >
              {index + 1}
            </div>
          ))}
        </div>
      </header>

      <div className="flex-grow flex flex-col items-center justify-center space-y-8">
        {profileOptions.map((option, index) => (
          <div key={index} className="flex flex-col items-center">
            <h2 className="text-xl font-bold">{option.label}</h2>
            <div className="flex space-x-4 mt-4">
              {option.subOptions.map((subOption, subIndex) => (
                <div
                  key={subIndex}
                  className={`p-4 border-2 rounded-lg cursor-pointer ${
                    selectedProfile === subOption.value
                      ? "border-yellow-400 bg-yellow-400 text-black"
                      : "border-gray-400"
                  }`}
                  onClick={() => setSelectedProfile(subOption.value)}
                >
                  {subOption.label}
                </div>
              ))}
            </div>
          </div>
        ))}
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
