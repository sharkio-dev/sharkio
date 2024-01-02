import React, { useState, useEffect, useRef } from "react";
import { LuRefreshCcw } from "react-icons/lu";
import { IoMdAlarm } from "react-icons/io";
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";
import { useOnClickOutside } from "../../hooks/use-on-click-outside";
interface RefreshButtonProps {
  refresh: () => void;
}

const RefreshButton: React.FC<RefreshButtonProps> = ({ refresh }) => {
  const [intervalValue, setIntervalValue] = useState<number | null>(null);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  const intervalOptions = [
    { value: 0, label: "Stop" },
    { value: 1, label: "1s" },
    { value: 5, label: "5s" },
    { value: 10, label: "10s" },
    { value: 30, label: "30s" },
    { value: 60, label: "60s" },
  ];
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const startAutoRefresh = (value: number) => {
    clearInterval(intervalId as NodeJS.Timeout);
    setIntervalId(null);

    if (value > 0) {
      const id = setInterval(() => {
        refresh();
      }, value * 1000);

      setIntervalId(id);
      setIsRefreshing(true);
    }
  };

  const handleIntervalChange = (value: number) => {
    setIsRefreshing(false);
    setIntervalValue(value);
    startAutoRefresh(value);
    setShowDropdown(false);
  };
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };
  const handleRefreshClick = () => {
    // Manual refresh when the "Refresh" button is clicked
    refresh();
  };

  useEffect(() => {
    if (intervalValue !== null) {
      startAutoRefresh(intervalValue);
    }
  }, []);

  const handleEscapeKey = (event: KeyboardEvent) => {
    if (event.key === "Escape" && showDropdown) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    if (intervalValue !== null) {
      startAutoRefresh(intervalValue);
    }

    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [intervalValue, showDropdown]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      clearInterval(intervalId as NodeJS.Timeout);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        clearInterval(intervalId as NodeJS.Timeout);
      } else if (intervalValue !== null && !isRefreshing) {
        startAutoRefresh(intervalValue);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    if (intervalValue !== null && !isRefreshing) {
      startAutoRefresh(intervalValue);
    }

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearInterval(intervalId as NodeJS.Timeout);
    };
  }, [intervalId,intervalValue, isRefreshing]);


  useOnClickOutside(dropdownRef, () => setShowDropdown(false));

  return (
    <div className="flex items-center  absolute ">
      <button
        className={`px-2 py-1 text-white text-sm 
        "bg-blue-500
      rounded cursor-pointer`}
        onClick={handleRefreshClick}
      >
        <span className="flex gap-1 items-center">
          {isRefreshing ? <IoMdAlarm size={18} /> : <LuRefreshCcw size={15} />}
          Refresh
        </span>
      </button>

      <div className="relative inline-block " ref={dropdownRef}>
        <button
          className="text-sm cursor-pointer  rounded-md focus:outline-none focus:border-blue-500 transition duration-300 ease-in-out"
          onClick={toggleDropdown}
        >
          {showDropdown ? (
            <MdArrowDropUp size={30} />
          ) : (
            <MdArrowDropDown size={30} />
          )}
        </button>
        {showDropdown && (
          <div className="absolute mt-1  w-24  bg-[#242424]  border rounded-md shadow-lg right-1   ">
            {intervalOptions.map((option) => (
              <div
                key={option.value}
                className="cursor-pointer px-2 py-1  text-gray-500 hover:bg-gray-900"
                onClick={() => handleIntervalChange(option.value)}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RefreshButton;
