// ./src/views/WeatherSetting.js
import React, { useRef, useState } from "react";
import styled from "@emotion/styled";
import { availableLocations } from "./../utils/helpers";

const WeatherSettingWrapper = styled.div`
  position: relative;
  min-width: 360px;
  box-shadow: ${({ theme }) => theme.boxShadow};
  background-color: ${({ theme }) => theme.foregroundColor};
  box-sizing: border-box;
  padding: 20px;
`;

const Title = styled.div`
  font-size: 28px;
  color: ${({ theme }) => theme.titleColor};
  margin-bottom: 30px;
`;

const StyledLabel = styled.label`
  display: block;
  font-size: 16px;
  color: ${({ theme }) => theme.textColor};
  margin-bottom: 15px;
`;

const StyledSelect = styled.select`
  display: block;
  box-sizing: border-box;
  background: transparent;
  border: 1px solid ${({ theme }) => theme.textColor};
  outline: none;
  width: 100%;
  max-width: 100%;
  color: ${({ theme }) => theme.textColor};
  font-size: 16px;
  padding: 7px 10px;
  margin-bottom: 40px;
  -webkit-appearance: none;
  -moz-appearance: none;
  box-shadow: none;
  outline: 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  > button {
    display: flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
    user-select: none;
    margin: 0;
    letter-spacing: 0.3px;
    line-height: 1;
    cursor: pointer;
    overflow: visible;
    text-transform: none;
    border: 1px solid transparent;
    background-color: transparent;
    height: 35px;
    width: 80px;
    border-radius: 5px;
    font-size: 14px;

    &:focus,
    &.focus {
      outline: 0;
      box-shadow: none;
    }

    &::-moz-focus-inner {
      padding: 0;
      border-style: none;
    }
  }
`;

const Back = styled.button`
  && {
    color: ${({ theme }) => theme.textColor};
    border-color: ${({ theme }) => theme.textColor};
  }
`;

const Save = styled.button`
  && {
    color: white;
    background-color: #40a9f3;
  }
`;

// ./src/views/WeatherSetting.js
// ...
const WeatherSetting = ({
  cityName,
  handleCurrentCityChange,
  handleCurrentPageChange,
}) => {
  const [locationName, setLocationName] = useState(cityName); // 把 cityName 當成預設值
  // STEP 2：使用 useRef 建立一個 ref，取名為 inputLocationRef
  const inputLocationRef = useRef(null);

  // STEP 2: 定義locationName，預設值先代為臺北市
  // const [locationName, setLocationName] = useState("臺北市");

  // STEP 4：定義 handleChange 要做的事
  const handleChange = (e) => {
    console.log(e.target.value);
    // STEP 5：把使用者輸入的內容更新到 React 內的資料狀態
    setLocationName(e.target.value);
  };

  // STEP 4：透過 inputLocationRef.current 取得透過 ref 指稱的 HTML 元素
  const handleSave = () => {
    // console.log("value", inputLocationRef.current.value);
    console.log(`儲存的地區資訊為: ${locationName}`);
    handleCurrentCityChange(locationName); // 更新 App 元件中的 currentCity 名稱
    handleCurrentPageChange("WeatherCard"); // 切換回 WeatherCard 頁面
    // 點擊儲存時，順便將使用者選擇的縣市名稱存入 localStorage 中
    localStorage.setItem("cityName", locationName);
  };

  return (
    <WeatherSettingWrapper>
      <Title>設定</Title>
      <StyledLabel htmlFor="location">地區</StyledLabel>
      <StyledSelect
        id="location"
        name="location"
        // ref={inputLocationRef}
        // defaultValue="新竹市"
        onChange={handleChange}
        // 透過 value 可以讓資料與畫面相對應
        value={locationName}
      >
        {availableLocations.map(({ cityName }) => (
          <option value={cityName} key={cityName}>
            {cityName}
          </option>
        ))}
      </StyledSelect>
      <ButtonGroup>
        <Back onClick={() => handleCurrentPageChange("WeatherCard")}>返回</Back>
        <Save onClick={handleSave}>儲存</Save>
      </ButtonGroup>
    </WeatherSettingWrapper>
  );
};

export default WeatherSetting;
