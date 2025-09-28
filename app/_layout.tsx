import { Stack } from "expo-router";
import { AuthProvider } from "./context/AuthContext";

export default function RootLayout() {
	return (
		<AuthProvider>
			<Stack
				screenOptions={{
					headerStyle: { backgroundColor: "#1A202C" },
					headerTintColor: "#E2E8F0",
					headerTitleStyle: { fontWeight: "bold" },
				}}>
				<Stack.Screen name="index" options={{ headerShown: false }} />
				<Stack.Screen
					name="auth"
					options={{
						title: "Authentication",
						headerBackButtonDisplayMode: "minimal",
					}}
				/>
				<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
			</Stack>
		</AuthProvider>
	);
}
