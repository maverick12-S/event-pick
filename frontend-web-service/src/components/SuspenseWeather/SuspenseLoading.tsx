import React, { Suspense } from 'react';

// API用URL
const url =
  'https://api.open-meteo.com/v1/forecast?latitude=35.6895&longitude=139.6917&hourly=temperature_2m&timezone=Asia%2FTokyo';

// APIレスポンスの型定義
interface WeatherData {
  hourly: {
    temperature_2m: number[];
    time: string[];
  };
}

let weatherData: WeatherData | undefined;

// APIデータ取得用処理
const fetchWeatherData = async (): Promise<WeatherData> => {
  const res = await fetch(url);
  const data = await res.json();
  weatherData = data;
  return data;
};

// コンポーネント描画処理
const WeatherDataComponent: React.FC = () => {
  if (!weatherData) {
    // Promiseをthrowして Suspense に委ねる
    throw fetchWeatherData();
  }

  return (
    <div style={{ color: '#fff', padding: 20 }}>
      <h2>Temperature Forecast</h2>
      {weatherData?.hourly && (
        <ul>
          {weatherData.hourly.time.map((time, index) => (
            <li key={time}>
              {time}: {weatherData!.hourly.temperature_2m[index]}°C
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const SuspenseLoading: React.FC = () => {
  return (
    <Suspense
      fallback={
        <div style={{
          position: 'fixed',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100vw',
          height: '100vh',
          background: '#0d1b2a',
          color: '#fff',
          zIndex: 9999,
        }}>
          <h1>Loading...</h1>
        </div>
      }
    >
      <WeatherDataComponent />
    </Suspense>
  );
};

export default SuspenseLoading;
