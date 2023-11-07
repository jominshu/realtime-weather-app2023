import React, { useState, useEffect, useCallback, useMemo } from "react";
import styled from "@emotion/styled"; //import styled from "@emotion/styled";
// import "./App.css";
import dayjs from "dayjs";
import WeatherIcon from "./components/WeatherIcon";

// API中各地區的日出與日落時間
import { findLocation, getMoment } from "./utils/helpers";

//在 App 元件中匯入並使用 views 中的 WeatherCard 跟 WeatherSetting 元件
import WeatherCard from "./views/WeatherCard";
import WeatherSetting from "./views/WeatherSetting";

// 從 @emotion/react 中載入 ThemeProvider
import { ThemeProvider } from "@emotion/react";
import useWeatherAPI from "./hooks/useWeatherAPI";

// import { ReactComponent as DayCloudyIcon } from "./images/day-cloudy.svg";
// import { ReactComponent as AirFlowIcon } from "./images/airFlow.svg";
// import { ReactComponent as RainIcon } from "./images/rain.svg";
// import { ReactComponent as RefreshIcon } from "./images/refresh.svg";
// import { ReactComponent as LoadingIcon } from "./images/loading.svg";

//中央氣象局API授權碼
const AUTHORIZATION_KEY = "CWA-9C51C58B-99AB-4EFA-8EEE-D39483129136";
const LOCATION_NAME = "新竹";
const LOCATION_NAME_FORECAST = "新竹縣";

const Container = styled.div`
  background-color: ${({ theme }) => theme.backgroundColor};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// const WeatherCard = styled.div`
//   position: relative;
//   min-width: 360px;
//   box-shadow: ${({ theme }) => theme.boxShadow};
//   background-color: ${({ theme }) => theme.foregroundColor};
//   box-sizing: border-box;
//   padding: 30px 15px;
// `;

//定義深色主題的配色
const theme = {
  light: {
    backgroundColor: "#ededed",
    foregroundColor: "#f9f9f9",
    boxShadow: "0 1px 3px 0 #999999",
    titleColor: "#212121",
    temperatureColor: "#757575",
    textColor: "#828282",
  },
  dark: {
    backgroundColor: "#1F2022",
    foregroundColor: "#121416",
    boxShadow:
      "0 1px 4px 0 rgba(12, 12, 13, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.15)",
    titleColor: "#f9f9fa",
    temperatureColor: "#dddddd",
    textColor: "#cccccc",
  },
};

// 定義帶有樣式的 `<Location />` 元件
// 在兩個反引號中放入該 Component 的 CSS 樣式
// 透過 props 取得傳進來的資料
// props 會是 {theme: "dark", children: "台北市"}
// 透過傳進來的資料決定要呈現的樣式
// const Location = styled.div`
//   font-size: 28px;
//   color: ${({ theme }) => theme.titleColor};
//   margin-bottom: 20px;
// `;

// const Description = styled.div`
//   font-size: 16px;
//   color: ${({ theme }) => theme.textColor};
//   margin-bottom: 30px;
// `;

// const CurrentWeather = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   margin-bottom: 30px;
// `;

// const Temperature = styled.div`
//   color: ${({ theme }) => theme.temperatureColor};
//   font-size: 96px;
//   font-weight: 300;
//   display: flex;
// `;

// const Celsius = styled.div`
//   font-weight: normal;
//   font-size: 42px;
// `;

// const AirFlow = styled.div`
//   display: flex;
//   align-items: center;
//   font-size: 16x;
//   font-weight: 300;
//   color: ${({ theme }) => theme.textColor};
//   margin-bottom: 20px;
//   svg {
//     width: 25px;
//     height: auto;
//     margin-right: 30px;
//   }
// `;

// const Rain = styled.div`
//   display: flex;
//   align-items: center;
//   font-size: 16x;
//   font-weight: 300;
//   color: ${({ theme }) => theme.textColor};
//   svg {
//     width: 25px;
//     height: auot;
//     margin-right: 30px;
//   }
// `;

// const Refresh = styled.div`
//   position: absolute;
//   right: 15px;
//   bottom: 15px;
//   font-size: 12px;
//   display: inline-flex;
//   align-items: flex-end;
//   color: ${({ theme }) => theme.textColor};
//   svg {
//     margin-left: 10px;
//     width: 15px;
//     height: 15px;
//     cursor: pointer;
//     animation: rotate infinite 1.5s linear;
//     animation-duration: ${({ isLoading }) => (isLoading ? "1.5s" : "0s")};
//   }

//   @keyframes rotate {
//     from {
//       transform: rotate(360deg);
//     }
//     to {
//       transform: rotate(0deg);
//     }
//   }
// `;

const App = () => {
  //STEP 1: 定義 currentPage 這個 state，預設值是 WeatherCard
  const [currentPage, setCurrentPage] = useState("WeatherCard");
  const handleCurrentPageChange = (currentPage) => {
    setCurrentPage(currentPage);
  };
  // console.log("invoke function component");

  // STEP 1：定義 currentCity
  const handleCurrentCityChange = (currentCity) => {
    setCurrentCity(currentCity);
  };

  // 從 localStorage 取出先前保存的地區，若沒有保存過則給予預設值
  const storageCity = localStorage.getItem("cityName") || "新竹縣";
  // 帶入 useState 作為 currentCity 的預設值
  const [currentCity, setCurrentCity] = useState(storageCity);

  // STEP 3：找出每支 API 需要帶入的 locationName
  // const currentLocation = findLocation(currentCity);
  // STEP 4 使用 useMemo 把取得的資料保存下來
  const currentLocation = useMemo(
    () => findLocation(currentCity),
    [currentCity]
  );

  // STEP 5：再透過解構賦值取出 currentLocation 的資料
  const { cityName, locationName, sunriseCityName } = currentLocation;

  // STEP 6：在 getMoment 的參數中換成 sunriseCityName
  const moment = useMemo(() => getMoment(sunriseCityName), [sunriseCityName]);

  // STEP 7：在 useWeatherAPI 中的參數改成 locationName 和 cityName
  //使用useWeatherAPI
  const [weatherElement, fetchData] = useWeatherAPI({
    locationName,
    cityName,
    authorizationKey: AUTHORIZATION_KEY,
  });

  // 使用 useState 並定義 currentTheme 的預設值為 light
  const [currentTheme, setCurrentTheme] = useState("light");

  // 定義會使用到的資料狀態
  // const [weatherElement, setWeatherElement] = useState({
  //   observationTime: new Date(),
  //   locationName: " ",
  //   temperature: 0,
  //   windSpeed: 0,
  //   description: " ",
  //   weatherCode: 0,
  //   rainPossibility: 0,
  //   comfortability: " ",
  //   isLoading: true, //多一個名為 isLoading 的狀態
  // });

  //使用useMemo讓locationName沒有變化的情形下不會重新計算，等使用者可以修改地區時要修改裡面的參數，先將 dependencies array 設為空陣列
  // const moment = useMemo(() => getMoment(LOCATION_NAME_FORECAST), []);

  useEffect(() => {
    // 根據 moment 決定要使用亮色或暗色主題
    setCurrentTheme(moment === "day" ? "light" : "dark");
  }, [moment]);

  // STEP 2：將 AUTHORIZATION_KEY 和 LOCATION_NAME 帶入 API 請求中
  // const handleClick = () => {
  //   fetch(
  //     //可能API有問題
  //     `https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=CWA-9C51C58B-99AB-4EFA-8EEE-D39483129136&locationName=%E6%96%B0%E7%AB%B9`
  //   ) // 向 requestURL 發送請求
  //     .then((response) => response.json()) // 取得伺服器回傳的資料並以 JSON 解析
  //     .then((data) => {
  //       // console.log("data", data); // 取得解析後的 JSON 資料
  //       // STEP 1：定義 `locationData` 把回傳的資料中會用到的部分取出來
  //       const locationData = data.records.location[0];

  //       // STEP 2：將風速（WDSD）和氣溫（TEMP）的資料取出
  //       const weatherElements = locationData.weatherElement.reduce(
  //         (neededElements, item) => {
  //           if (["WDSD", "TEMP"].includes(item.elementName)) {
  //             neededElements[item.elementName] = item.elementValue;
  //           }
  //           return neededElements;
  //         },
  //         {}
  //       );
  // useEffect(() => {
  //   // useEffect 中 console.log
  //   console.log("execute function in useEffect");
  //   fetchCurrentWeather();
  //   fetchWeatherForecast();
  // }, []); //放入[]空陣列讓dependencies不被改變，防止無限迴圈

  // STEP 1：在 useEffect 中定義 async function 取名為 fetchData
  // const fetchData = useCallback(async () => {
  //   // 在開始拉取資料前，先把 isLoading 的狀態改成 true
  //   setWeatherElement((prevState) => ({
  //     ...prevState,
  //     isLoading: true,
  //   }));
  //   // STEP 2：使用 Promise.all 搭配 await 等待兩個 API 都取得回應後才繼續
  //   const [currentWeather, weatherForecast] = await Promise.all([
  //     fetchCurrentWeather(),
  //     fetchWeatherForecast(),
  //   ]);

  //   setWeatherElement({
  //     ...currentWeather,
  //     ...weatherForecast,
  //     isLoading: false,
  //   });
  //   // STEP 3：檢視取得的資料
  //   // console.log(data);
  // }, []);

  // useEffect(() => {
  //   console.log("---execute function in useEffect---");
  //   // STEP 4：再 useEffect 中呼叫 fetchData 方法
  //   fetchData();
  // }, [fetchData]);

  // const fetchCurrentWeather = () => {
  //   setWeatherElement((prevState) => ({
  //     ...prevState,
  //     isLoading: true,
  //   }));
  //   // 留意這裡加上 return 直接把 fetch API 回傳的 Promise 再回傳出去
  //   return fetch(
  //     `https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=CWA-9C51C58B-99AB-4EFA-8EEE-D39483129136&locationName=%E6%96%B0%E7%AB%B9`
  //   ) // 向 requestURL 發送請求
  //     .then((response) => response.json()) // 取得伺服器回傳的資料並以 JSON 解析
  //     .then((data) => {
  //       // console.log("data", data); // 取得解析後的 JSON 資料
  //       // STEP 1：定義 `locationData` 把回傳的資料中會用到的部分取出來
  //       const locationData = data.records.location[0];

  //       // STEP 2：將風速（WDSD）和氣溫（TEMP）的資料取出
  //       const weatherElements = locationData.weatherElement.reduce(
  //         (neededElements, item) => {
  //           if (["WDSD", "TEMP"].includes(item.elementName)) {
  //             neededElements[item.elementName] = item.elementValue;
  //           }
  //           return neededElements;
  //         },
  //         {}
  //       );
  //       return {
  //         observationTime: locationData.time.obsTime,
  //         locationName: locationData.locationName,
  //         temperature: weatherElements.TEMP,
  //         windSpeed: weatherElements.WDSD,
  //         isLoading: false,
  //       };

  //       // setWeatherElement((prevState) => ({
  //       //   ...prevState,
  //       //   observationTime: locationData.time.obsTime,
  //       //   locationName: locationData.locationName,
  //       //   temperature: weatherElements.TEMP,
  //       //   windSpeed: weatherElements.WDSD,
  //       //   isLoading: false,
  //       // }));
  //     });
  // };

  // const fetchWeatherForecast = () => {
  //   // 留意這裡加上 return 直接把 fetch API 回傳的 Promise 再回傳出去
  //   return fetch(
  //     `https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWA-9C51C58B-99AB-4EFA-8EEE-D39483129136&locationName=%E6%96%B0%E7%AB%B9%E7%B8%A3`
  //   )
  //     .then((response) => response.json())
  //     .then((data) => {
  //       // 取出某縣市的預報資料
  //       const locationData = data.records.location[0];

  //       const weatherElements = locationData.weatherElement.reduce(
  //         (neededElements, item) => {
  //           // 只保留需要用到的「天氣現象」、「降雨機率」和「舒適度」
  //           if (["Wx", "PoP", "CI"].includes(item.elementName)) {
  //             // 這支 API 會回傳未來 36 小時的資料，這裡只需要取出最近 12 小時的資料，因此使用 item.time[0]
  //             neededElements[item.elementName] = item.time[0].parameter;
  //           }
  //           return neededElements;
  //         },
  //         {}
  //       );
  //       return {
  //         description: weatherElements.Wx.parameterName,
  //         weatherCode: weatherElements.Wx.parameterValue,
  //         rainPossibility: weatherElements.PoP.parameterName,
  //         comfortability: weatherElements.CI.parameterName,
  //       };
  //       // setWeatherElement((prevState) => ({
  //       //   ...prevState,
  //       //   description: weatherElements.Wx.parameterName,
  //       //   weatherCode: weatherElements.Wx.parameterValue,
  //       //   rainPossibility: weatherElements.PoP.parameterName,
  //       //   comfortability: weatherElements.CI.parameterName,
  //       // }));
  //     });
  // };

  // const {
  //   observationTime,
  //   locationName,
  //   description,
  //   windSpeed,
  //   temperature,
  //   rainPossibility,
  //   isLoading,
  //   comfortability,
  //   weatherCode,
  // } = weatherElement;

  return (
    <ThemeProvider theme={theme[currentTheme]}>
      <Container>
        {/* {console.log("render, isLoading: ", weatherElement.isLoading)} */}
        {currentPage === "WeatherCard" && (
          <WeatherCard
            // 將 WeatherCard 需要的資料，透過 props 從 App 元件傳入
            cityName={cityName}
            weatherElement={weatherElement}
            moment={moment}
            fetchData={fetchData}
            handleCurrentPageChange={handleCurrentPageChange}
          />
        )}
        {currentPage === "WeatherSetting" && (
          //  將 cityName 和 handleCurrentCityChange 傳入 ＷeatherSetting 元件中
          <WeatherSetting
            cityName={cityName}
            handleCurrentCityChange={handleCurrentCityChange}
            handleCurrentPageChange={handleCurrentPageChange}
          />
        )}
      </Container>
    </ThemeProvider>
  );
};

// function App() {
//   return (
//     <div className="container">
//       <div className="weather-card">
//         <h1>Weather</h1>
//       </div>
//     </div>
//   );
// }

export default App;
