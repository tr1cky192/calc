import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function LoginStep() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [user, setUser] = useState(null);
  const [errors, setErrors] = useState({ email: '', password: '', terms: '', general: '' });
 
  // useEffect(() => {
  //   const authToken = localStorage.getItem('authToken');
  //   if (authToken) {
  //     checkTokenValidity(authToken);
  //   }
  // }, []);

  const checkTokenValidity = async (token) => {
    const response = await fetch('https://asmos.hi-it.com.ua/wp-json/custom/v1/verify_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
  
    const data = await response.json();
    if (response.ok && data.valid) {
      setUser(data.user);
      setIsAuthenticated(true);
      console.log('User after setUser:', data.user); 
      router.push('/panel'); 
    } else {
      logout();
      localStorage.removeItem('authToken'); 
    }
  };

  const handleLogin = async () => {
    setErrors({ email: '', password: '', terms: '', general: '' });
  
    let valid = true;
  
    if (!email) {
      setErrors((prevErrors) => ({ ...prevErrors, email: 'Введіть ваш логін' }));
      valid = false;
    }
  
    if (!password) {
      setErrors((prevErrors) => ({ ...prevErrors, password: 'Введіть пароль' }));
      valid = false;
    }
  
    if (!acceptedTerms) {
      setErrors((prevErrors) => ({ ...prevErrors, terms: 'Погодьтесь з умовами' }));
      valid = false;
    }
  
    if (valid) {
      const response = await fetch('https://asmos.hi-it.com.ua/wp-json/custom/v1/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: email,
          password: password,
        }),
      });
  
      const data = await response.json();
      console.log('Login Response:', data);
      if (response.ok) {
        localStorage.setItem('userData', JSON.stringify(data.user));
        localStorage.setItem('authToken', data.token);
        setUser(data.user);
        setIsAuthenticated(true);
        router.push('/panel'); 
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          general: data.message || 'Невірний логін або пароль. Спробуйте ще раз.',
        }));
      }
    }
  };

  const handleDemo = () => {
    router.push('/panel');
  };
  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    setIsAuthenticated(false);
    router.push('/');
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
              className={`w-8 h-8 border-2 rounded-full flex items-center justify-center ${index === 1 ? 'border-yellow-400 text-yellow-400' : 'border-gray-400 text-gray-400'}`}
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
            <h2 className="text-xl mb-4">ДЛЯ ЗАРЕЄСТРОВАНИХ КОРИСТУВАЧІВ</h2>

            {/* General error message */}
            {errors.general && <p className="text-red-500 mb-2">{errors.general}</p>}

            {/* Email input */}
            {errors.email && <p className="text-red-500 mb-2">{errors.email}</p>}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 mb-4 rounded-lg bg-white text-black"
              placeholder="Логін"
            />

            {/* Password input */}
            {errors.password && <p className="text-red-500 mb-2">{errors.password}</p>}
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 mb-4 rounded-lg bg-white text-black"
              placeholder="Пароль"
            />

            {/* Terms acceptance */}
            {errors.terms && <p className="text-red-500 mb-2">{errors.terms}</p>}
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mr-2"
              />
              <label className="text-sm">Я погоджуюсь з умовами</label>
            </div>

            <button
              className="w-full px-6 py-3 bg-yellow-400 text-black font-semibold rounded-lg"
              onClick={handleLogin}
            >
              ВВІЙТИ
            </button>

            <p className="mt-4 text-center underline cursor-pointer" onClick={() => router.push('/register')}>
              ЗАРЕЄСТРУВАТИСЬ
            </p>
          </div>

          {/* Demo mode */}
          <div className="flex flex-col items-center justify-center">
            <h2 className="text-xl mb-4">БЕЗ РЕЄСТРАЦІЇ</h2>
            <button
              className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg"
              onClick={handleDemo}
            >
              ДЕМО РЕЖИМ
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="flex justify-between p-8">
        <button
          className="px-6 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg"
          onClick={() => router.back()}
        >
          ВИЙТИ
        </button>
      </footer>
    </div>
  );
}