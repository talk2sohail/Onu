import { Tabs } from "expo-router";
import { AntDesign } from "@expo/vector-icons";

export default function TabsLayout() {
	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: "#3182CE", // Active icon color
				tabBarInactiveTintColor: "#A0AEC0", // Inactive icon color
				tabBarStyle: {
					backgroundColor: "#1A202C", // Tab bar background
					borderTopColor: "#4A5568",
				},
				headerShown: false, // We can add headers within each screen if needed
			}}>
			<Tabs.Screen
				name="workspace"
				options={{
					title: "Workspace",
					tabBarIcon: ({ color }) => (
						<AntDesign name="code-sandbox" size={24} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="clone"
				options={{
					title: "Clone",
					tabBarIcon: ({ color }) => (
						<AntDesign name="github" size={24} color={color} />
					),
				}}
			/>
		</Tabs>
	);
}
