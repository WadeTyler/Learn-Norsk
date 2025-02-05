import React from 'react';
import {LoadingLG} from "@/components/util/Loading";

const LoadingScreen = () => {
  return (
    <div className={"flex items-center justify-center w-full h-screen"}>
      <LoadingLG/>
    </div>
  );
};

export default LoadingScreen;