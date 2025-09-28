import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

export default function OnuLogo({ width = 100, height = 100 }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 100 100">
      <Circle cx="50" cy="50" r="45" fill="#3182CE" />
      <Path
        d="M35 40 C35 25, 65 25, 65 40 L65 60 C65 75, 35 75, 35 60 Z"
        fill="#E2E8F0"
      />
    </Svg>
  );
}
