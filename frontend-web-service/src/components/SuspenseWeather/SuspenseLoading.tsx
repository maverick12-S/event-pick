import React, { Suspense } from 'react';
import bg from '../../assets/images/login-bg.png';
import styles from '../../features/login/components/LoginForm/screens/LoginScreen.module.css';

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
        <div
          className={styles.pageWrapper}
          style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundImage: `url(${bg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundColor: '#0d1b2a',
            color: '#fff',
            zIndex: 9999,
          }}
        >
          <div style={{
            minWidth: 200,
            maxWidth: '70%',
            height: 56,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255,255,255,0.08)',
            color: '#fff',
            borderRadius: 10,
            border: '1px solid rgba(255,255,255,0.12)',
            boxShadow: '0 6px 20px rgba(2,6,23,0.45)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            fontSize: 16,
            fontWeight: 600,
          }}>Loading・・・ </div>
        </div>
      }
    >
      <WeatherDataComponent />
    </Suspense>
  );
};

export default SuspenseLoading;
