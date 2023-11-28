import React from 'react'
import '../App.css';
import {AiOutlineSearch} from 'react-icons/ai'
import {WiHumidity} from 'react-icons/wi'
import {SiWindicss} from 'react-icons/si'
import {RiLoaderFill} from 'react-icons/ri'
import {TiWeatherPartlySunny} from 'react-icons/ti'
import { BsFillSunFill, BsCloudyFill, BsFillCloudRainFill, BsCloudFog2Fill} from 'react-icons/bs'
import axios from 'axios'


interface WeatherProps {
    dt: number;
    name: string;
    main: {
        temp: number;
        humidity: number;
    };
    sys: {
        country: string;
    };
    weather: {
        main: string;
    }[];
    wind: {
        speed: number;
    };

}

const DisplayWeather = () => {

    const api_key = "daf73af968383d4916b133e7e95edf0b";
    const api_Endpoint = "https://api.openweathermap.org/data/2.5/";

    const [weatherData, setWeatherData] = React.useState<WeatherProps | null>(null)
    const [isLoading,setIsLoading] = React.useState(false)
    const [searchCity,setSearchCity] = React.useState("")

    const fetchWeatherData = async (lat:number, lon:number) => {
        const url = `${api_Endpoint}weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`;
        const response = await axios.get(url);        
        return response.data;
    }


    const fetchWeatherOnSearch = async (city:string) => {
        try {
          const url = `${api_Endpoint}weather?q=${city}&appid=${api_key}&units=metric`;
          const SearchResponse = await axios.get(url);

          const currentSearchResults:WeatherProps = SearchResponse.data;
          
          return {currentSearchResults}
        }catch (error) {
          throw error;
        }
    }

    const handleSearch = async () => {
        if (searchCity.trim() === "") {
           return;
        }

        try {
            const {currentSearchResults} = await fetchWeatherOnSearch(searchCity);
            setWeatherData(currentSearchResults)
        }catch (error) {

        }
    } 

    const IconChanger = (weather:string) => {
        let IconElement: React.ReactNode;
        let IconColor: string;


        switch (weather) {
            case "Rain":
                IconElement = <BsFillCloudRainFill/>
                IconColor = "#272829"
                break;
            case "Clear":
                IconElement = <BsFillSunFill/>
                IconColor = "#FFC436"
                break;
            case "Cloud":
                IconElement = <BsCloudyFill/>
                IconColor = "#102C57"
                break;
            case "Mist":
                IconElement = <BsCloudFog2Fill/>
                IconColor = "#279EFF"
                break;
            default:
                IconElement = <TiWeatherPartlySunny/>
                IconColor = "#7B2869"
                break;
        }

        return (
            <span className='icon' style={{color:IconColor}}>
                {IconElement}
            </span>
        )
    }

    const GetTime = (time:number) => {
        let timezone = new Date(time*1000)
        // timezone.setHours(timezone.getHours() + 1)For GMT+1
        let Today = timezone.toUTCString()

        return (
            Today
        )
    }

    


    React.useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {            
            const {latitude,longitude} = position.coords;
            Promise.all([fetchWeatherData(latitude,longitude)]).then(
                ([currentWeather]) => {
                    setIsLoading(true)
                    setWeatherData(currentWeather);
                }
            )
        })
    }, [])

    

  return (
    <div className='Main'>
        <div className="container">
            <div className="searchArea">
                <input 
                type="text" 
                placeholder='Enter a city'
                value={searchCity}
                onChange={(e)=> setSearchCity(e.target.value)}/>

                <div className="searchCircle">
                   <AiOutlineSearch className='searchIcon' onClick={handleSearch}/>
                </div>
            </div>

            {weatherData && isLoading ?(
                <>
                    <div className="weatherArea">
                        <h1>{weatherData.name}</h1>
                        <span>{weatherData.sys.country}</span>

                        <div className="icon">{IconChanger(weatherData.weather[0].main)}</div>
                        <h1>{weatherData.main.temp.toFixed(0)}<sup>0</sup>c</h1>
                        <h2>{weatherData.weather[0].main}</h2>
                    </div>

                    <div className="bottomInfoArea">
                        <div className="humidityLevel">
                            <WiHumidity className='windIcon'/>
                            <div className="humidityInfo">
                                <h1>{weatherData.main.humidity}%</h1>
                                <p>Humidity</p>
                            </div>
                        </div>

                        <div className="wind">
                            <SiWindicss className='windIcon'/>
                            <div className="humidityInfo">
                                <h1>{weatherData.wind.speed}km/h</h1>
                                <p>Wind Speed</p>
                            </div>
                        </div>
                    </div>

                    <div className="time">
                        <h3>{GetTime(weatherData.dt)}</h3>
                    </div>
                </>
            ):(
                <div className="loading">
                    <RiLoaderFill className='loadingIcon' />
                    <p>Loading</p>
                </div>
            )
            }



            
            
        </div>
    </div>
  )
}

export default DisplayWeather