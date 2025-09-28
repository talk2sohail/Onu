import { Text, View, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function WorkspaceScreen() {
  return (
    <View style={styles.container}>
      <Feather name="inbox" size={80} color="#4A5568" style={styles.icon} />
      <Text style={styles.title}>Workspace is Empty</Text>
      <Text style={styles.subtitle}>
        Cloned repositories will appear here.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A202C',
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E2E8F0',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#A0AEC0',
    textAlign: 'center',
    paddingHorizontal: 50,
  },
});
