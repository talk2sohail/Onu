import React from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { Fontisto } from "@expo/vector-icons";

interface GlassButtonProps {
	onPress: () => void;
	iconName: React.ComponentProps<typeof Fontisto>["name"];
	size?: number;
}

export default function GlassButton({
	onPress,
	iconName,
	size = 50,
}: GlassButtonProps) {
	const iconSize = size * 0.5;

	return (
		<TouchableOpacity
			onPress={onPress}
			style={[styles.container, { width: size, height: size }]}>
			<Svg height={size} width={size} style={StyleSheet.absoluteFill}>
				<Circle
					cx={size / 2}
					cy={size / 2}
					r={size / 2}
					fill="rgba(255, 255, 255, 0.15)" // Simple, semi-transparent fill
				/>
			</Svg>
			<Fontisto name={iconName} size={iconSize} color="white" />
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	container: {
		justifyContent: "center",
		alignItems: "center",
	},
});
