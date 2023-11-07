import { useState, useEffect, useCallback } from "react";

const fetchCurrentWeather = ({ authorizationKey, locationName }) => {
  // 留意這裡加上 return 直接把 fetch API 回傳的 Promise 再回傳出去
  return fetch(
    `https://opendata.cwa.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=${authorizationKey}&locationName=${locationName}`
  ) // 向 requestURL 發送請求
    .then((response) => response.json()) // 取得伺服器回傳的資料並以 JSON 解析
    .then((data) => {
      // console.log("data", data); // 取得解析後的 JSON 資料
      // STEP 1：定義 `locationData` 把回傳的資料中會用到的部分取出來
      const locationData = data.records.location[0];

      // STEP 2：將風速（WDSD）和氣溫（TEMP）的資料取出
      const weatherElements = locationData.weatherElement.reduce(
        (neededElements, item) => {
          if (["WDSD", "TEMP"].includes(item.elementName)) {
            neededElements[item.elementName] = item.elementValue;
          }
          return neededElements;
        },
        {}
      );
      return {
        observationTime: locationData.time.obsTime,
        locationName: locationData.locationName,
        temperature: weatherElements.TEMP,
        windSpeed: weatherElements.WDSD,
      };

      // setWeatherElement((prevState) => ({
      //   ...prevState,
      //   observationTime: locationData.time.obsTime,
      //   locationName: locationData.locationName,
      //   temperature: weatherElements.TEMP,
      //   windSpeed: weatherElements.WDSD,
      //   isLoading: false,
      // }));
    });
};

const fetchWeatherForecast = ({ authorizationKey, cityName }) => {
  // 留意這裡加上 return 直接把 fetch API 回傳的 Promise 再回傳出去
  return fetch(
    `https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${authorizationKey}&locationName=${cityName}`
  )
    .then((response) => response.json())
    .then((data) => {
      // 取出某縣市的預報資料
      const locationData = data.records.location[0];

      const weatherElements = locationData.weatherElement.reduce(
        (neededElements, item) => {
          // 只保留需要用到的「天氣現象」、「降雨機率」和「舒適度」
          if (["Wx", "PoP", "CI"].includes(item.elementName)) {
            // 這支 API 會回傳未來 36 小時的資料，這裡只需要取出最近 12 小時的資料，因此使用 item.time[0]
            neededElements[item.elementName] = item.time[0].parameter;
          }
          return neededElements;
        },
        {}
      );
      return {
        description: weatherElements.Wx.parameterName,
        weatherCode: weatherElements.Wx.parameterValue,
        rainPossibility: weatherElements.PoP.parameterName,
        comfortability: weatherElements.CI.parameterName,
      };
      // setWeatherElement((prevState) => ({
      //   ...prevState,
      //   description: weatherElements.Wx.parameterName,
      //   weatherCode: weatherElements.Wx.parameterValue,
      //   rainPossibility: weatherElements.PoP.parameterName,
      //   comfortability: weatherElements.CI.parameterName,
      // }));
    });
};

const useWeatherAPI = ({ locationName, cityName, authorizationKey }) => {
  //useState 中用來定義 weatherElement 的部分
  const [weatherElement, setWeatherElement] = useState({
    observationTime: new Date(),
    locationName: "",
    temperature: 0,
    windSpeed: 0,
    description: "",
    weatherCode: 0,
    rainPossibility: 0,
    comfortability: "",
    isLoading: true,
  });

  const fetchData = useCallback(async () => {
    // 在開始拉取資料前，先把 isLoading 的狀態改成 true
    setWeatherElement((prevState) => ({
      ...prevState,
      isLoading: true,
    }));
    // STEP 2：使用 Promise.all 搭配 await 等待兩個 API 都取得回應後才繼續
    const [currentWeather, weatherForecast] = await Promise.all([
      fetchCurrentWeather({ authorizationKey, locationName }),
      fetchWeatherForecast({ authorizationKey, cityName }),
    ]);

    setWeatherElement({
      ...currentWeather,
      ...weatherForecast,
      isLoading: false,
    });
    // STEP 3：檢視取得的資料
    // console.log(data);
  }, [authorizationKey, cityName, locationName]);

  useEffect(() => {
    console.log("---execute function in useEffect---");
    // STEP 4：再 useEffect 中呼叫 fetchData 方法
    fetchData();
  }, [fetchData]);

  return [weatherElement, fetchData];
};

export default useWeatherAPI;
