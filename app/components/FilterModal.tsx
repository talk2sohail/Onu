
import React from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";

// A generic modal for selecting filter options to reduce code duplication.
interface FilterModalProps<T extends string> {
  visible: boolean;
  onClose: () => void;
  title: string;
  options: readonly T[] | T[];
  onSelect: (option: T) => void;
  renderOptionText?: (option: T) => string;
}

const FilterModal = <T extends string>({
  visible,
  onClose,
  title,
  options,
  onSelect,
  renderOptionText = (option) =>
    option.charAt(0).toUpperCase() + option.slice(1),
}: FilterModalProps<T>) => (
  <Modal
    animationType="slide"
    transparent={true}
    visible={visible}
    onRequestClose={onClose}
  >
    <TouchableOpacity
      style={styles.modalContainer}
      activeOpacity={1}
      onPressOut={onClose}
    >
      <TouchableWithoutFeedback>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <AntDesign name="close" size={24} color="#E2E8F0" />
            </TouchableOpacity>
          </View>
          <ScrollView>
            {options.map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.modalOption}
                onPress={() => onSelect(option)}
              >
                <Text style={styles.modalOptionText}>
                  {renderOptionText(option)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </TouchableOpacity>
  </Modal>
);

const styles = StyleSheet.create({
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
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#E2E8F0",
  },
  closeButton: {
    padding: 5,
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

export default FilterModal;
