import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Linking,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "./context/AuthContext";
import { AntDesign } from "@expo/vector-icons";

export default function AuthScreen() {
  const [token, setToken] = useState("");
  const router = useRouter();
  const { login } = useAuth();

  const handleLinkPress = () => {
    Linking.openURL("https://github.com/settings/tokens/new?scopes=repo");
  };

  const handleConnect = () => {
    if (token.trim() !== "") {
      login(token.trim());
      router.replace("/workspace");
    }
  };

  if (Platform.OS === "web") {
    return (
      <View style={styles.container}>
        <View style={styles.inner}>
          <View style={styles.titleContainer}>
            <AntDesign
              name="github"
              size={50}
              color="#E2E8F0"
              style={styles.githubIcon}
            />
            <Text style={styles.title}>Connect to GitHub</Text>
          </View>
          <Text style={styles.instructions}>
            To continue, please enter a GitHub Personal Access Token. This token
            will be stored securely on your device.
          </Text>
          <TouchableOpacity onPress={handleLinkPress}>
            <Text style={styles.link}>
              Create a new token with 'repo' scope here.
            </Text>
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="ghp_..."
            placeholderTextColor="#A0AEC0"
            value={token}
            onChangeText={setToken}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity
            style={[styles.button, !token && styles.buttonDisabled]}
            disabled={!token}
            onPress={handleConnect}
          >
            <Text style={styles.buttonText}>Connect</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={80}
        style={styles.container}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
            <View style={styles.titleContainer}>
              <AntDesign
                name="github"
                size={50}
                color="#E2E8F0"
                style={styles.githubIcon}
              />
              <Text style={styles.title}>Connect to GitHub</Text>
            </View>
            <Text style={styles.instructions}>
              To continue, please enter a GitHub Personal Access Token. This
              token will be stored securely on your device.
            </Text>
            <TouchableOpacity onPress={handleLinkPress}>
              <Text style={styles.link}>
                Create a new token with 'repo' scope here.
              </Text>
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="ghp_..."
              placeholderTextColor="#A0AEC0"
              value={token}
              onChangeText={setToken}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity
              style={[styles.button, !token && styles.buttonDisabled]}
              disabled={!token}
              onPress={handleConnect}
            >
              <Text style={styles.buttonText}>Connect</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A202C",
  },
  inner: {
    padding: 20,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  githubIcon: {
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#E2E8F0",
  },
  instructions: {
    fontSize: 16,
    color: "#A0AEC0",
    textAlign: "center",
    maxWidth: "90%",
    marginBottom: 10,
  },
  link: {
    fontSize: 16,
    color: "#3182CE",
    textDecorationLine: "underline",
    marginBottom: 30,
  },
  input: {
    width: "100%",
    backgroundColor: "#2D3748",
    color: "#E2E8F0",
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#4A5568",
  },
  button: {
    backgroundColor: "#3182CE",
    paddingVertical: 15,
    paddingHorizontal: 80,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#4A5568",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});
