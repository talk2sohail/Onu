import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { AntDesign, Octicons } from "@expo/vector-icons";

// Define the shape of the repo object, can be expanded
export interface Repo {
	id: number;
	full_name: string;
	description: string | null;
	language: string | null;
	stargazers_count: number;
	private: boolean;
}

interface RepoCardProps {
	repo: Repo;
}

export default function RepoCard({ repo }: RepoCardProps) {
	return (
		<View style={styles.card}>
			<View style={styles.header}>
				<Octicons
					name="repo"
					size={16}
					color="#A0AEC0"
					style={styles.repoIcon}
				/>
				<Text style={styles.repoName}>{repo.full_name}</Text>
				<View style={styles.visibilityBadge}>
					<Text style={styles.visibilityText}>
						{repo.private ? "Private" : "Public"}
					</Text>
				</View>
			</View>
			{repo.description && (
				<Text style={styles.repoDescription}>{repo.description}</Text>
			)}
			<View style={styles.metadata}>
				{repo.language && (
					<View style={styles.metaItem}>
						<Octicons name="dot-fill" size={16} color="#3182CE" />
						<Text style={styles.metaText}>{repo.language}</Text>
					</View>
				)}
				<View style={styles.metaItem}>
					<AntDesign name="star" size={16} color="#A0AEC0" />
					<Text style={styles.metaText}>{repo.stargazers_count}</Text>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	card: {
		backgroundColor: "#2D3748",
		borderRadius: 10,
		padding: 15,
		marginHorizontal: 20,
		marginBottom: 15,
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 8,
	},
	repoIcon: {
		marginRight: 8,
	},
	repoName: {
		fontSize: 16,
		fontWeight: "bold",
		color: "#E2E8F0",
		flex: 1,
	},
	visibilityBadge: {
		borderWidth: 1,
		borderColor: "#4A5568",
		borderRadius: 12,
		paddingHorizontal: 8,
		paddingVertical: 2,
	},
	visibilityText: {
		fontSize: 10,
		color: "#A0AEC0",
		fontWeight: "600",
	},
	repoDescription: {
		fontSize: 14,
		color: "#A0AEC0",
		marginBottom: 12,
	},
	metadata: {
		flexDirection: "row",
		alignItems: "center",
	},
	metaItem: {
		flexDirection: "row",
		alignItems: "center",
		marginRight: 16,
	},
	metaText: {
		marginLeft: 5,
		fontSize: 12,
		color: "#A0AEC0",
	},
});
