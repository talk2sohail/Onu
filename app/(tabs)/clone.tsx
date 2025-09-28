import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
	Text,
	View,
	StyleSheet,
	FlatList,
	ActivityIndicator,
	TextInput,
	RefreshControl,
	SafeAreaView,
	TouchableOpacity,
	Modal,
	ScrollView,
	TouchableWithoutFeedback,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import RepoCard, { Repo } from "../components/RepoCard";
import GlassButton from "../components/GlassButton";
import { AntDesign } from "@expo/vector-icons";

type FilterType = "all" | "public" | "private" | "forks";

type SortType =
	| "Recently pushed"
	| "Newest"
	| "Oldest"
	| "Most starred"
	| "Least starred";

const sortOptions: SortType[] = [
	"Recently pushed",
	"Newest",
	"Oldest",
	"Most starred",
	"Least starred",
];

export default function CloneScreen() {
	const { token } = useAuth();
	const [allRepos, setAllRepos] = useState<Repo[]>([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [isSearchActive, setIsSearchActive] = useState(false);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const [typeFilter, setTypeFilter] = useState<FilterType>("all");
	const [isTypeModalVisible, setIsTypeModalVisible] = useState(false);
	const [languageFilter, setLanguageFilter] = useState<string>("all");
	const [isLanguageModalVisible, setIsLanguageModalVisible] = useState(false);
	const [languages, setLanguages] = useState<string[]>([]);
	const [sortFilter, setSortFilter] = useState<SortType>("Recently pushed");
	const [isSortModalVisible, setIsSortModalVisible] = useState(false);
	const [activeFilterCount, setActiveFilterCount] = useState(0);

	useEffect(() => {
		let count = 0;
		if (typeFilter !== "all") {
			count++;
		}
		if (languageFilter !== "all") {
			count++;
		}
		if (sortFilter !== "Recently pushed") {
			count++;
		}
		setActiveFilterCount(count);
	}, [typeFilter, languageFilter, sortFilter]);

	const fetchRepos = useCallback(
		async (filter: FilterType, sort: SortType) => {
			if (!token) {
				setLoading(false);
				setError("Authentication token not found.");
				return;
			}
			try {
				let sortQuery = "pushed";
				let direction = "desc";

				if (sort === "Newest") {
					sortQuery = "created";
				} else if (sort === "Oldest") {
					sortQuery = "created";
					direction = "asc";
				}

				let apiUrl = `https://api.github.com/user/repos?sort=${sortQuery}&direction=${direction}`;
				if (filter === "public" || filter === "private") {
					apiUrl += `&type=${filter}`;
				} else {
					apiUrl += `&type=all`;
				}

				const response = await fetch(apiUrl, {
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
				});
				if (!response.ok) {
					throw new Error(
						`Failed to fetch repositories. Status: ${response.status}`
					);
				}
				let data = await response.json();

				if (filter === "forks") {
					data = data.filter((repo: Repo) => repo.fork === true);
				}

				setAllRepos(data);
				const uniqueLanguages = Array.from(
					new Set(data.map((repo: Repo) => repo.language).filter(Boolean))
				) as string[];
				setLanguages(["all", ...uniqueLanguages]);
				setError(null);
			} catch (e: any) {
				setError(e.message);
			}
		},
		[token]
	);

	useEffect(() => {
		setLoading(true);
		fetchRepos(typeFilter, sortFilter).finally(() => setLoading(false));
	}, [fetchRepos, typeFilter, sortFilter]);

	const onRefresh = useCallback(async () => {
		setRefreshing(true);
		await fetchRepos(typeFilter, sortFilter);
		setRefreshing(false);
	}, [fetchRepos, typeFilter, sortFilter]);

	const sortedRepos = useMemo(() => {
		const sorted = [...allRepos];
		if (sortFilter === "Most starred") {
			sorted.sort((a, b) => b.stargazers_count - a.stargazers_count);
		} else if (sortFilter === "Least starred") {
			sorted.sort((a, b) => a.stargazers_count - b.stargazers_count);
		}
		return sorted;
	}, [allRepos, sortFilter]);

	const filteredRepos = useMemo(() => {
		return sortedRepos.filter((repo) => {
			const matchesSearch = repo.full_name
				.toLowerCase()
				.includes(searchQuery.toLowerCase());
			const matchesLanguage =
				languageFilter === "all" || repo.language === languageFilter;
			return matchesSearch && matchesLanguage;
		});
	}, [sortedRepos, searchQuery, languageFilter]);

	const renderFilterModal = () => (
		<Modal
			animationType="slide"
			transparent={true}
			visible={isTypeModalVisible}
			onRequestClose={() => setIsTypeModalVisible(false)}>
			<TouchableOpacity
				style={styles.modalContainer}
				activeOpacity={1}
				onPressOut={() => setIsTypeModalVisible(false)}>
				<TouchableWithoutFeedback>
					<View style={styles.modalContent}>
						<Text style={styles.modalTitle}>Select Type</Text>
						{["all", "public", "private", "forks"].map((type) => (
							<TouchableOpacity
								key={type}
								style={styles.modalOption}
								onPress={() => {
									setTypeFilter(type as FilterType);
									setIsTypeModalVisible(false);
								}}>
								<Text style={styles.modalOptionText}>
									{type.charAt(0).toUpperCase() + type.slice(1)}
								</Text>
							</TouchableOpacity>
						))}
					</View>
				</TouchableWithoutFeedback>
			</TouchableOpacity>
		</Modal>
	);

	const renderLanguageModal = () => (
		<Modal
			animationType="slide"
			transparent={true}
			visible={isLanguageModalVisible}
			onRequestClose={() => setIsLanguageModalVisible(false)}>
			<TouchableOpacity
				style={styles.modalContainer}
				activeOpacity={1}
				onPressOut={() => setIsLanguageModalVisible(false)}>
				<TouchableWithoutFeedback>
					<View style={styles.modalContent}>
						<Text style={styles.modalTitle}>Select Language</Text>
						{languages.map((lang) => (
							<TouchableOpacity
								key={lang}
								style={styles.modalOption}
								onPress={() => {
									setLanguageFilter(lang);
									setIsLanguageModalVisible(false);
								}}>
								<Text style={styles.modalOptionText}>
									{lang.charAt(0).toUpperCase() + lang.slice(1)}
								</Text>
							</TouchableOpacity>
						))}
					</View>
				</TouchableWithoutFeedback>
			</TouchableOpacity>
		</Modal>
	);

	const renderSortModal = () => (
		<Modal
			animationType="slide"
			transparent={true}
			visible={isSortModalVisible}
			onRequestClose={() => setIsSortModalVisible(false)}>
			<TouchableOpacity
				style={styles.modalContainer}
				activeOpacity={1}
				onPressOut={() => setIsSortModalVisible(false)}>
				<TouchableWithoutFeedback>
					<View style={styles.modalContent}>
						<Text style={styles.modalTitle}>Sort by</Text>
						{sortOptions.map((option) => (
							<TouchableOpacity
								key={option}
								style={styles.modalOption}
								onPress={() => {
									setSortFilter(option);
									setIsSortModalVisible(false);
								}}>
								<Text style={styles.modalOptionText}>{option}</Text>
							</TouchableOpacity>
						))}
					</View>
				</TouchableWithoutFeedback>
			</TouchableOpacity>
		</Modal>
	);

	if (loading) {
		return (
			<View style={styles.container}>
				<ActivityIndicator size="large" color="#3182CE" />
				<Text style={styles.loadingText}>Fetching Repositories...</Text>
			</View>
		);
	}

	if (error) {
		return (
			<View style={styles.container}>
				<Text style={styles.errorText}>Error: {error}</Text>
			</View>
		);
	}

	return (
		<SafeAreaView style={styles.listContainer}>
			{renderFilterModal()}
			{renderLanguageModal()}
			{renderSortModal()}
			<View style={styles.header}>
				{isSearchActive ? (
					<TextInput
						style={styles.searchBarHeader}
						placeholder="Search repositories..."
						placeholderTextColor="#A0AEC0"
						value={searchQuery}
						onChangeText={setSearchQuery}
						autoFocus
					/>
				) : (
					<View style={styles.headerTitleContainer}>
						<Text style={styles.title}>Repositories</Text>
					</View>
				)}
				<View style={styles.searchIconContainer}>
					<GlassButton
						onPress={() => setIsSearchActive(!isSearchActive)}
						iconName={isSearchActive ? "close" : "search"}
						size={40}
					/>
				</View>
			</View>

			<View>
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={styles.filtersContainer}>
					{activeFilterCount > 0 && (
						<TouchableOpacity
							style={styles.filterButton}
							onPress={() => {
								setTypeFilter("all");
								setLanguageFilter("all");
								setSortFilter("Recently pushed");
							}}>
							<AntDesign
								style={{ marginRight: 5 }}
								name="close-circle"
								size={13}
								color="#A0AEC0"
							/>
							<Text style={styles.filterButtonTextSelected}>
								{activeFilterCount}
							</Text>
						</TouchableOpacity>
					)}
					<TouchableOpacity
						style={styles.filterButton}
						onPress={() => setIsTypeModalVisible(true)}>
						<Text
							style={
								typeFilter === "all"
									? styles.filterButtonText
									: styles.filterButtonTextSelected
							}>
							{typeFilter === "all"
								? "Type"
								: typeFilter.charAt(0).toUpperCase() + typeFilter.slice(1)}
						</Text>
						<AntDesign name="down" size={12} color="#A0AEC0" />
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.filterButton}
						onPress={() => setIsLanguageModalVisible(true)}>
						<Text
							style={
								languageFilter === "all"
									? styles.filterButtonText
									: styles.filterButtonTextSelected
							}>
							{languageFilter === "all"
								? "Language"
								: languageFilter.charAt(0).toUpperCase() +
								  languageFilter.slice(1)}
						</Text>
						<AntDesign name="down" size={12} color="#A0AEC0" />
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.filterButton}
						onPress={() => setIsSortModalVisible(true)}>
						<Text
							style={
								sortFilter === "Recently pushed"
									? styles.filterButtonText
									: styles.filterButtonTextSelected
							}>
							{`Sort: ${sortFilter}`}
						</Text>
						<AntDesign name="down" size={12} color="#A0AEC0" />
					</TouchableOpacity>
				</ScrollView>
			</View>

			<FlatList
				data={filteredRepos}
				renderItem={({ item }) => <RepoCard repo={item} />}
				keyExtractor={(item) => item.id.toString()}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={onRefresh}
						tintColor="#A0AEC0"
					/>
				}
				contentContainerStyle={{ paddingBottom: 50 }}
			/>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#1A202C",
	},
	listContainer: {
		flex: 1,
		backgroundColor: "#1A202C",
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 20,
		paddingTop: 20,
		paddingBottom: 10,
		position: "relative",
	},
	headerTitleContainer: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#E2E8F0",
	},
	searchIconContainer: {
		position: "absolute",
		right: 15,
		top: 12,
	},
	filtersContainer: {
		flexGrow: 1,
		alignItems: "center",
		flexDirection: "row",
		paddingHorizontal: 20,
		paddingBottom: 15,
	},
	filterButton: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#2D3748",
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderRadius: 8,
		marginRight: 10,
	},
	filterButtonText: {
		color: "#A0AEC0",
		fontSize: 13,
		marginRight: 5,
	},
	filterButtonTextSelected: {
		color: "#E2E8F0",
		fontSize: 13,
		marginRight: 5,
		fontWeight: "bold",
	},
	searchBarHeader: {
		flex: 1,
		backgroundColor: "#2D3748",
		color: "#E2E8F0",
		marginRight: 60,
		padding: 10,
		borderRadius: 10,
		fontSize: 16,
	},
	loadingText: {
		marginTop: 10,
		color: "#A0AEC0",
	},
	errorText: {
		color: "#EF4444",
		fontSize: 16,
	},
	modalContainer: {
		flex: 1,
		justifyContent: "flex-end",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
	modalContent: {
		backgroundColor: "#2D3748",
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		padding: 20,
	},
	modalTitle: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#E2E8F0",
		marginBottom: 20,
	},
	modalOption: {
		paddingVertical: 15,
		borderBottomWidth: 1,
		borderBottomColor: "#4A5568",
	},
	modalOptionText: {
		fontSize: 18,
		color: "#E2E8F0",
	},
});
