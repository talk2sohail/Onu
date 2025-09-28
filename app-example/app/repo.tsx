import { useState } from "react";
import {
	StyleSheet,
	Text,
	View,
	TextInput,
	TouchableOpacity,
	FlatList,
	KeyboardAvoidingView,
	Platform,
	ActivityIndicator,
	Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

export default function RepoScreen() {
	const router = useRouter();
	const [repoUrl, setRepoUrl] = useState("");
	const [repoInfo, setRepoInfo] = useState({ owner: "", repo: "" });
	const [files, setFiles] = useState<any[]>([]);
	const [path, setPath] = useState("");
	const [loading, setLoading] = useState(false);

	const fetchRepoContents = async (
		newPath: string,
		owner_arg?: string,
		repo_arg?: string
	) => {
		const owner = owner_arg || repoInfo.owner;
		const repo = repo_arg || repoInfo.repo;

		if (!owner || !repo) return;

		setLoading(true);
		setFiles([]);
		try {
			const response = await fetch(
				`https://api.github.com/repos/${owner}/${repo}/contents/${newPath}`
			);
			if (!response.ok) {
				throw new Error("Failed to fetch repository contents.");
			}
			const data = await response.json();
			setFiles(
				data.sort(
					(a: any, b: any) =>
						a.type.localeCompare(b.type) || a.name.localeCompare(b.name)
				)
			);
			setPath(newPath);
		} catch (error: any) {
			Alert.alert("Error", error.message);
		} finally {
			setLoading(false);
		}
	};

	const handleInitialFetch = async () => {
		if (!repoUrl) {
			Alert.alert("Error", "Please enter a repository URL.");
			return;
		}
		const urlParts = repoUrl.split("github.com/")[1]?.split("/");
		if (!urlParts || urlParts.length < 2) {
			Alert.alert("Error", "Invalid GitHub URL format.");
			return;
		}
		const owner = urlParts[0];
		const repo = urlParts[1].replace(".git", "");
		setRepoInfo({ owner, repo });
		await fetchRepoContents("", owner, repo);
	};

	const handleItemPress = (item: any) => {
		if (item.type === "dir") {
			fetchRepoContents(item.path);
		}
	};

	const handleBackPress = () => {
		if (path === "") {
			router.back();
		} else {
			const parentPath = path.substring(0, path.lastIndexOf("/"));
			fetchRepoContents(parentPath);
		}
	};

	const renderHeader = () => {
		const currentFolder =
			path === "" ? "root" : path.substring(path.lastIndexOf("/") + 1);
		return (
			<View style={styles.headerContainer}>
				<TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
					<Text style={styles.backButtonText}>{"< "}</Text>
				</TouchableOpacity>
				<Text style={styles.headerTitle} numberOfLines={1}>
					{currentFolder}
				</Text>
			</View>
		);
	};

	return (
		<LinearGradient
			colors={["#4c669f", "#3b5998", "#192f6a"]}
			style={styles.container}>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				style={{ flex: 1 }}>
				{repoInfo.owner === "" ? (
					<View style={styles.inputContainer}>
						<Text style={styles.label}>Enter your GitHub Repository URL:</Text>
						<TextInput
							style={styles.input}
							value={repoUrl}
							onChangeText={setRepoUrl}
							placeholder="https://github.com/user/repo"
							placeholderTextColor="#ccc"
							autoCapitalize="none"
						/>
						<TouchableOpacity
							style={styles.button}
							onPress={handleInitialFetch}>
							<Text style={styles.buttonText}>Analyze Repository</Text>
						</TouchableOpacity>
					</View>
				) : (
					<View style={styles.listContainer}>
						{renderHeader()}
						{loading ? (
							<ActivityIndicator
								size="large"
								color="#fff"
								style={{ marginTop: 20 }}
							/>
						) : (
							<FlatList
								data={files}
								keyExtractor={(item) => item.sha}
								renderItem={({ item }) => (
									<TouchableOpacity
										onPress={() => handleItemPress(item)}
										disabled={item.type !== "dir"}>
										<View style={styles.fileItem}>
											<Text style={styles.fileText}>
												{item.type === "dir" ? "📁" : "📄"} {item.name}
											</Text>
										</View>
									</TouchableOpacity>
								)}
								style={styles.list}
							/>
						)}
					</View>
				)}
			</KeyboardAvoidingView>
		</LinearGradient>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	inputContainer: {
		flex: 1,
		justifyContent: "center",
		padding: 20,
	},
	listContainer: {
		flex: 1,
	},
	label: {
		fontSize: 18,
		color: "#fff",
		textAlign: "center",
		marginBottom: 20,
	},
	input: {
		width: "100%",
		backgroundColor: "rgba(255, 255, 255, 0.9)",
		padding: 15,
		borderRadius: 10,
		marginBottom: 20,
		fontSize: 16,
	},
	button: {
		backgroundColor: "#fff",
		paddingVertical: 15,
		paddingHorizontal: 40,
		borderRadius: 25,
		alignSelf: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
	buttonText: {
		color: "#3b5998",
		fontSize: 18,
		fontWeight: "bold",
	},
	list: {
		width: "100%",
		marginTop: 10,
		paddingHorizontal: 20,
	},
	fileItem: {
		backgroundColor: "rgba(255, 255, 255, 0.1)",
		padding: 15,
		borderRadius: 5,
		marginBottom: 10,
	},
	fileText: {
		color: "#fff",
		fontSize: 16,
	},
	headerContainer: {
		flexDirection: "row",
		alignItems: "center",
		paddingTop: 50,
		paddingBottom: 10,
		paddingHorizontal: 10,
		backgroundColor: "transparent",
	},
	backButton: {
		padding: 10,
		marginRight: 10,
	},
	backButtonText: {
		color: "#fff",
		fontSize: 18,
	},
	headerTitle: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "bold",
		flex: 1,
		textAlign: "center",
	},
});
