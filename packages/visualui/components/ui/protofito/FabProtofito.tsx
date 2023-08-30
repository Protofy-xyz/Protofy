import React from "react";
import { Image } from "native-base";

export const FabProtofito = (props) => {
  const diameter = 60
  const margin = 30

  return (
    <div
      style={{
        backgroundColor: '#e7e5e4', height: diameter, width: diameter,
        position: 'fixed', zIndex: 2, right: margin, bottom: margin,
        borderRadius: 20, justifyContent: 'center', display: 'flex',
        cursor: 'pointer', outline: '3px solid black'
      }}
      onClick={() => props.onPress()}
    >
      <Image alt="protofito" alignSelf={'center'} resizeMode="contain" source={require("../../../assets/protofitos/protofito-basic.png")} size="xs" />
    </div>
  );
};
