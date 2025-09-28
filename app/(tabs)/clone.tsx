import React, { useEffect, useState, useMemo, useCallback } from 'react';
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
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import RepoCard, { Repo } from '../components/RepoCard';
import GlassButton from '../components/GlassButton';
import { AntDesign } from '@expo/vector-icons';

type FilterType = 'all' | 'public' | 'private' | 'forks';

export default function CloneScreen() {
  const { token } = useAuth();
  const [allRepos, setAllRepos] = useState<Repo[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [typeFilter, setTypeFilter] = useState<FilterType>('all');
  const [isTypeModalVisible, setIsTypeModalVisible] = useState(false);

  const fetchRepos = useCallback(async (filter: FilterType) => {
    if (!token) {
      setLoading(false);
      setError('Authentication token not found.');
      return;
    }
    try {
      let apiUrl = 'https://api.github.com/user/repos?sort=pushed';
      if (filter === 'public' || filter === 'private') {
        apiUrl += `&type=${filter}`;
      } else {
        apiUrl += `&type=all`;
      }

      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch repositories. Status: ${response.status}`);
      }
      let data = await response.json();

      if (filter === 'forks') {
        data = data.filter((repo: Repo) => repo.fork === true);
      }

      setAllRepos(data);
      setError(null);
    } catch (e: any) {
      setError(e.message);
    }
  }, [token]);

  useEffect(() => {
    setLoading(true);
    fetchRepos(typeFilter).finally(() => setLoading(false));
  }, [fetchRepos, typeFilter]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchRepos(typeFilter);
    setRefreshing(false);
  }, [fetchRepos, typeFilter]);

  const filteredRepos = useMemo(() => {
    return allRepos.filter((repo) =>
      repo.full_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allRepos, searchQuery]);

  const renderFilterModal = () => (
    <Modal
        animationType="slide"
        transparent={true}
        visible={isTypeModalVisible}
        onRequestClose={() => setIsTypeModalVisible(false)}
    >
        <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Select Type</Text>
                {['all', 'public', 'private', 'forks'].map((type) => (
                    <TouchableOpacity key={type} style={styles.modalOption} onPress={() => {
                        setTypeFilter(type as FilterType);
                        setIsTypeModalVisible(false);
                    }}>
                        <Text style={styles.modalOptionText}>{type.charAt(0).toUpperCase() + type.slice(1)}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
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
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
            <Text style={styles.title}>Repositories</Text>
        </View>
        <View style={styles.searchIconContainer}>
            <GlassButton
                onPress={() => setIsSearchActive(!isSearchActive)}
                iconName="search"
                size={40}
            />
        </View>
      </View>

      <View style={styles.filtersContainer}>
        <TouchableOpacity style={styles.filterButton} onPress={() => setIsTypeModalVisible(true)}>
          <Text style={styles.filterButtonText}>Type: {typeFilter}</Text>
          <AntDesign name="down" size={12} color="#A0AEC0" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterButtonText}>Language</Text>
          <AntDesign name="down" size={12} color="#A0AEC0" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterButtonText}>Sort</Text>
          <AntDesign name="down" size={12} color="#A0AEC0" />
        </TouchableOpacity>
      </View>

      {isSearchActive && (
        <TextInput
          style={styles.searchBar}
          placeholder="Search repositories..."
          placeholderTextColor="#A0AEC0"
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoFocus
        />
      )}

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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A202C',
  },
  listContainer: {
    flex: 1,
    backgroundColor: '#1A202C',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    position: 'relative',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E2E8F0',
  },
  searchIconContainer: {
    position: 'absolute',
    right: 15,
    top: 12,
  },
  filtersContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2D3748',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 10,
  },
  filterButtonText: {
    color: '#A0AEC0',
    fontSize: 14,
    marginRight: 5,
  },
  searchBar: {
    backgroundColor: '#2D3748',
    color: '#E2E8F0',
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
  },
  loadingText: {
    marginTop: 10,
    color: '#A0AEC0',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#2D3748',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E2E8F0',
    marginBottom: 20,
  },
  modalOption: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#4A5568',
  },
  modalOptionText: {
    fontSize: 18,
    color: '#E2E8F0',
  },
});
