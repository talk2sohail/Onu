import React, { useEffect } from "react";
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import OnuLogo from "./components/OnuLogo";
import { useAuth } from "./context/AuthContext";

export default function WelcomeScreen() {
  const router = useRouter();
  const { token, loading } = useAuth();

  useEffect(() => {
    if (!loading && token) {
      router.replace("/(tabs)/workspace");
    }
  }, [loading, token, router]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3182CE" />
      </View>
    );
  }

  if (token) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <OnuLogo width={150} height={150} />
        <Text style={styles.appName}>Onu</Text>
        <Text style={styles.tagline}>Commit to GitHub from your mobile</Text>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/auth")}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A202C",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  appName: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#E2E8F0",
    marginTop: 10,
    marginBottom: 10,
  },
  tagline: {
    fontSize: 18,
    color: "#A0AEC0",
    textAlign: "center",
    maxWidth: "100%",
  },
  button: {
    backgroundColor: "#3182CE",
    paddingVertical: 15,
    paddingHorizontal: 80,
    borderRadius: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});
