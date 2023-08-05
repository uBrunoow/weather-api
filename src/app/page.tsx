'use client'

import React, { useEffect, useRef, useState } from 'react'
import { MapPin, Bell, ChevronDown, CloudRain , Droplets ,Wind , Search , Github , Instagram} from 'lucide-react'
import axios from 'axios';
import moment from 'moment-timezone';
import Loader from '@/components/Loader';
import { motion } from 'framer-motion';


interface Weather {
  id: number;
  cityElement: string;
  tempElement: number;
  tempMaxElement: number;
  tempMinElement: number;
  descElement: string;
  weatherIconElement: string;
  countryElement: string;
  umidityElement: number;
  windElement: number;
  countryName: string;
  weatherFeelsLike: number
  targetTimeZone: string;
}

const page = () => {

  const defaultCity = 'São Paulo'
  const [city, setCity] = useState('');
  const [weathers, setWeathers] = useState<Weather[]>([]);
  const [hour, setHour] = useState('');
  const [minute, setMinute] = useState('');
  const [monthAbbreviation, setMonthAbbreviation] = useState('');
  const [dayAbbreviation, setDayAbbreviation] = useState('');
  const [loading, setLoading] = useState(false);
  const [cityIsOpen, setCityIsOpen] = useState(false)
  const [ bellIsOpen, setBellIsOpen] = useState(false)
  const formRef = useRef<HTMLFormElement>(null);
  
  // API keys
  const apiKey = '34c43eecb7dca8dd15e7f43c1c3debe9'
  const geoApiKey = 'd60b9cc3d66b4112aaa079feaad8e9da'

  const handleCity = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setCity(value);
  };

  const handleOpenCityClick = () => {
    setCityIsOpen(!cityIsOpen)
    const ArrowSwift = document.getElementById('ArrowSwift') as HTMLImageElement
    const HeaderTextOpen = document.getElementById('HeaderTextOpen') as HTMLDivElement
    const HeaderBellText = document.getElementById('HeaderBellText') as HTMLDivElement
    if (cityIsOpen) {
      HeaderTextOpen.style.color = '#fff'
      HeaderBellText.style.display = 'block'
      ArrowSwift.style.rotate = '0deg'
    } else {
      HeaderBellText.style.display = 'none'
      HeaderTextOpen.style.color = '#08244F'
      ArrowSwift.style.rotate = '180deg'
    }
  }

  const handleOpenBellClick = () => {
    setBellIsOpen(!bellIsOpen)
  }

  const handleClickedCity = async (clickedCity:string) => {
    const ArrowSwift = document.getElementById('ArrowSwift') as HTMLImageElement
    const HeaderTextOpen = document.getElementById('HeaderTextOpen') as HTMLDivElement
    const HeaderBellText = document.getElementById('HeaderBellText') as HTMLDivElement
    const responseCity = clickedCity
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${responseCity}&units=metric&appid=${apiKey}&lang=pt_br`);
      const openCageDataGeocodeUrl = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${responseCity}&key=${geoApiKey}`);
    
      const weatherData = response.data;
      const geoData = openCageDataGeocodeUrl.data;
    
      const mappedWeatherData: Weather = {
        id: weatherData.weather[0].id,
        cityElement: weatherData.name,
        tempElement: parseInt(weatherData.main.temp),
        descElement: weatherData.weather[0].description,
        weatherIconElement: `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`,
        countryElement: `https://flagsapi.com/${weatherData.sys.country}/shiny/64.png`,
        countryName: weatherData.sys.country,
        umidityElement: weatherData.main.humidity,
        windElement: weatherData.wind.speed,
        tempMaxElement: parseInt(weatherData.main.temp_max),
        tempMinElement: parseInt(weatherData.main.temp_min),
        weatherFeelsLike: parseInt(weatherData.main.feels_like),
        targetTimeZone: geoData.results[0].annotations.timezone.name,
      };
      setWeathers([mappedWeatherData]);
      setCity('')
  
      // Obter a hora na zona de tempo alvo
      const targetTimeZone = geoData.results[0].annotations.timezone.name;
      const dateInTargetTimeZone = moment().tz(targetTimeZone);
  
      // Extrair as informações de data e hora formatadas
      setHour(dateInTargetTimeZone.format('HH'));
      setMinute(dateInTargetTimeZone.format('mm'));
      setMonthAbbreviation(dateInTargetTimeZone.format('MMM'));
      setDayAbbreviation(dateInTargetTimeZone.format('DD'));
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }
    setCityIsOpen(false)
    HeaderTextOpen.style.color = '#fff'
    HeaderBellText.style.display = 'block'
    ArrowSwift.style.rotate = '0deg'
  }

  const fetchWeatherData = async (city: string) => {
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}&lang=pt_br`);
      const openCageDataGeocodeUrl = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${city}&key=${geoApiKey}`);
    
      const weatherData = response.data;
      const geoData = openCageDataGeocodeUrl.data;
    
      const mappedWeatherData: Weather = {
        id: weatherData.weather[0].id,
        cityElement: weatherData.name,
        tempElement: parseInt(weatherData.main.temp),
        descElement: weatherData.weather[0].description,
        weatherIconElement: `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`,
        countryElement: `https://flagsapi.com/${weatherData.sys.country}/shiny/64.png`,
        countryName: weatherData.sys.country,
        umidityElement: weatherData.main.humidity,
        windElement: weatherData.wind.speed,
        tempMaxElement: parseInt(weatherData.main.temp_max),
        tempMinElement: parseInt(weatherData.main.temp_min),
        weatherFeelsLike: parseInt(weatherData.main.feels_like),
        targetTimeZone: geoData.results[0].annotations.timezone.name,
      };
      setWeathers([mappedWeatherData]);
      setCity('')
  
      // Obter a hora na zona de tempo alvo
      const targetTimeZone = geoData.results[0].annotations.timezone.name;
      const dateInTargetTimeZone = moment().tz(targetTimeZone);
  
      // Extrair as informações de data e hora formatadas
      setHour(dateInTargetTimeZone.format('HH'));
      setMinute(dateInTargetTimeZone.format('mm'));
      setMonthAbbreviation(dateInTargetTimeZone.format('MMM'));
      setDayAbbreviation(dateInTargetTimeZone.format('DD'));
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }
  };

  // Chamando a cidade padrão (São Paulo)
  useEffect(() => {
    // Função para buscar o clima da cidade padrão
    const fetchDefaultWeather = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${defaultCity}&units=metric&appid=${apiKey}&lang=pt_br`
        );
        const openCageDataGeocodeUrl = await axios.get(
          `https://api.opencagedata.com/geocode/v1/json?q=${defaultCity}&key=${geoApiKey}`
        );

        const weatherData = response.data;
        const geoData = openCageDataGeocodeUrl.data;

        const mappedWeatherData: Weather = {
          id: weatherData.weather[0].id,
          cityElement: weatherData.name,
          tempElement: parseInt(weatherData.main.temp),
          descElement: weatherData.weather[0].description,
          weatherIconElement: `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`,
          countryElement: `https://flagsapi.com/${weatherData.sys.country}/shiny/64.png`,
          countryName: weatherData.sys.country,
          umidityElement: weatherData.main.humidity,
          windElement: weatherData.wind.speed,
          tempMaxElement: parseInt(weatherData.main.temp_max),
          tempMinElement: parseInt(weatherData.main.temp_min),
          weatherFeelsLike: parseInt(weatherData.main.feels_like),
          targetTimeZone: geoData.results[0].annotations.timezone.name,
        };
        setWeathers([mappedWeatherData]);

        const targetTimeZone = geoData.results[0].annotations.timezone.name;
        const dateInTargetTimeZone = moment().tz(targetTimeZone);
    
        // Extrair as informações de data e hora formatadas
        setHour(dateInTargetTimeZone.format('HH'));
        setMinute(dateInTargetTimeZone.format('mm'));
        setMonthAbbreviation(dateInTargetTimeZone.format('MMM'));
        setDayAbbreviation(dateInTargetTimeZone.format('DD'));
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      } finally {
        setLoading(false); // Desativa o loading, seja sucesso ou erro
      }
    };

    // Chamando a função para buscar o clima da cidade padrão
    fetchDefaultWeather();
  }, []);

  return (
    <section className='flex items-center justify-center w-full h-screen'>
      <div className='container h-[858px] w-[423px] py-11 px-10 relative'>
        {loading && (
          <Loader />
        )}
        {weathers.length > 0 && (
          <>
            <header className='flex justify-between select-none'>
              <div className='text-[#fff] flex gap-2 items-center z-[1001] cursor-pointer' onClick={handleOpenCityClick} id='HeaderTextOpen'>
                <MapPin className='h-[27px] w-[27px]'/>
                <h1 className=' text-[18px] font-semibold'>{weathers[0].cityElement}</h1>
                <ChevronDown className='h-[27px] w-[27px]' id='ArrowSwift'/>
              </div>
              <div className='text-[#fff] relative cursor-pointer' id='HeaderBellText' onClick={handleOpenBellClick}>
                <Bell className='h-[29px] w-[27px]'/>
                <span className='h-[15px] w-[15px] bg-red-500 rounded-full text-[11px] font-semibold flex items-center justify-center absolute top-[-5px] right-[-2px]'>1</span>
              </div>
            </header>

            <main className='flex flex-col items-center justify-center'>        
              <div className=' h-[207px] w-[284px] flex items-center justify-center select-none'>
                <img src={weathers[0].weatherIconElement} alt="" className='h-[100px] w-[100px]' />
              </div>
              <div className='text-center mb-[31px]'>
                <h1 className='text-white text-[64px] font-semibold'>{weathers[0].tempElement} Cº</h1>
                <p className='text-white text-[18px] font-normal'>Precipitações <br /> Max.: {weathers[0].tempMaxElement} Cº Min.: {weathers[0].tempMaxElement} Cº</p>
              </div>

              <div className='box-shadow w-[343px] h-[47px] rounded-[20px] bg-[rgba(0,16,38,0.3)] mb-5'>
                <div className='flex items-center justify-between px-[21px] py-[7px] h-full'>
                  <div className='text-white p-[5px] inline-flex justify-center items-center gap-[5px]'>
                    <CloudRain className='h-[24px] w-[24px]'/>
                    <span className='text-white text-[14px] font-semibold'>{weathers[0].weatherFeelsLike} Cº</span>
                  </div>
                  <div className='text-white p-[5px] inline-flex justify-center items-center gap-[5px]'>
                    <Droplets className='h-[24px] w-[24px]'/>
                    <span className='text-white text-[14px] font-semibold'>{weathers[0].umidityElement}%</span>
                  </div>
                  <div className='text-white p-[5px] inline-flex justify-center items-center gap-[5px]'>
                    <Wind className='h-[24px] w-[24px]'/>
                    <span className='text-white text-[14px] font-semibold'>{weathers[0].windElement} km/h</span>
                  </div>
                </div>
              </div>

              <div className='box-shadow w-[343px] h-[217px] rounded-[20px] bg-[rgba(0,16,38,0.3)] px-4 py-3 mb-5'>
                <div className='flex justify-between mb-3'>
                  <h1 className='text-white text-[20px] font-semibold text-shadow'>Hoje</h1>
                  <p className='text-white text-[18px] font-normal text-shadow'>{monthAbbreviation}, {dayAbbreviation}</p>
                </div>
                <div className='relative mb-[14px]'>
                  <div className='w-[309px] h-[147px] rounded-[20px] bg-[#10428d] z-20 absolute top-[1px] left-[1px] flex flex-col justify-between px-3 py-4'>
                    <div className='relative h-full'>
                      <h1 className='text-white text-[16px] font-semibold text-shadow'>{weathers[0].cityElement}, {weathers[0].countryName}</h1>
                      <p className='text-white text-[15px] font-normal text-shadow'>{hour} : {minute}</p>
                      <p className='text-white text-[15px] font-normal text-shadow capitalize'> {weathers[0].descElement}</p>
                      <div className='h-[40px] w-[40px]'><img src={weathers[0].weatherIconElement} alt="" /></div>
                      <div className='absolute right-0 bottom-0'>
                        <img src={weathers[0].countryElement} alt="" className='h-[45px] w-[45px] rounded-lg' />
                      </div>
                    </div>
                  </div>
                  <div className='w-full h-[150px] rounded-[20px] radial-gradient flex items-center justify-center p-2'></div>
                </div>
              </div>

              <div className='w-[343px] h-[50px]'>
                <form 
                  ref={formRef} onSubmit={(e) => {
                    e.preventDefault();
                    fetchWeatherData(city);
                  }}
                >
                  <label htmlFor="" className='flex relative items-center justify-center'>
                    <input type="text" name="" id="" className='w-full h-full rounded-[10px] box-shadow text-[20px] py-4 pl-4 pr-16' placeholder="Search" value={city} onChange={handleCity}/>
                    <button type="submit" className='absolute right-0 top-0 h-full w-[50px] bg-[#2d81ff] rounded-[10px] flex items-center justify-center text-white font-bold'><Search/></button>
                  </label>
                </form>
              </div>
            </main>
          </>
        )}

        {cityIsOpen && (
          <motion.div
            className=' h-[856px] w-[421px] py-11 px-10 rounded-[40px] bg-white absolute top-[1px] left-[1px] z-[200]'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className='mt-[50px]'>
                <div
                className='w-full block py-5 border-top cursor-pointer hover:text-[#08244F] hover:font-semibold'
                onClick={() => handleClickedCity('Tokyo')}
                >
                Tokyo, JP
                </div>

                <div
                className='w-full block py-5 border-top cursor-pointer hover:text-[#08244F] hover:font-semibold'
                onClick={() => handleClickedCity('Buenos Aires')}
                >
                Buenos Aires, AR
                </div>

                <div
                className='w-full block py-5 border-top cursor-pointer hover:text-[#08244F] hover:font-semibold'
                onClick={() => handleClickedCity('New York')}
                >
                New York, US
                </div>

                <div
                className='w-full block py-5 border-top cursor-pointer hover:text-[#08244F] hover:font-semibold'
                onClick={() => handleClickedCity('Cape Town')}
                >
                Cape Town, ZA
                </div>

                <div
                className='w-full block py-5 border-top cursor-pointer hover:text-[#08244F] hover:font-semibold'
                onClick={() => handleClickedCity('London')}
                >
                London, GB
                </div>

                <div
                className='w-full block py-5 border-top cursor-pointer hover:text-[#08244F] hover:font-semibold'
                onClick={() => handleClickedCity('Paris')}
                >
                Paris, FR
                </div>

                <div
                className='w-full block py-5 border-top cursor-pointer hover:text-[#08244F] hover:font-semibold'
                onClick={() => handleClickedCity('Veneza')}
                >
                Venice, IT
                </div>
            </div>
          </motion.div>
        )}

        {bellIsOpen && (
          <motion.div>
            <div className='bg-white h-[250px] w-[300px] absolute top-[100px] right-[40px] z-40 rounded-[10px] box-shadow p-5'>
              <h1 className=' text-black text-[20px] font-semibold'>Este é o meu aplicativo de clima</h1>
              <p>Se você gostou deste projeto, confira meu github e deixe uma estrela para me ajudar. </p>
              <img src="https://i.redd.it/wqdlbd8opvo91.gif" alt="" className='h-[100px] w-[100px] my-5'/>
              <span className='absolute bottom-2 right-2 bg-black rounded-full h-10 w-10 flex items-center justify-center box-shadow hover:opacity-[0.5]'>
                <a href="https://github.com/uBrunoow/weather-api" target='_blank' className=''><Github className='text-white'/></a>
              </span>
              <span className='absolute bottom-2 right-14 InstagramBG rounded-full h-10 w-10 flex items-center justify-center box-shadow hover:opacity-[0.5]'>
                <a href="https://www.instagram.com/brunow___/" target='_blank' className=''><Instagram className='text-white'/></a>
              </span>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}

export default page