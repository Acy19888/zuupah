/**
 * Category Chip Component
 * Selectable category button
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { TYPOGRAPHY } from '@constants/typography';

interface CategoryChipProps {
  label: string;
  isSelected?: boolean;
  onPress: () => void;
}

/**
 * CategoryChip Component
 * Displays a selectable category chip with highlight on selection
 */
export const CategoryChip: React.FC<CategoryChipProps> = ({
  label,
  isSelected = false,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.chip,
        isSelected && styles.chipSelected,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.label,
          isSelected && styles.labelSelected,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 8,
    marginBottom: 8,
  },
  chipSelected: {
    backgroundColor: COLORS.beachBlue,
    borderColor: COLORS.beachBlue,
  },
  label: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'Nunito-Medium',
    color: COLORS.darkText,
  },
  labelSelected: {
    color: COLORS.white,
  },
});

export default CategoryChip;
