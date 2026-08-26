import { useState } from "react";

export const useProgress= ()=>{
  const [progressPercentage, setProgressPercentage] = useState(0);
  const resetProgress=()=>{
    setProgressPercentage(0)
  }
  return {progressPercentage,resetProgress,setProgressPercentage}
}