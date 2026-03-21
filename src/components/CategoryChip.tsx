/**
 * Category Chip Component
 * Selectable category button
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '@hooks/useAppTheme';
import { COLORS } from '@constants/colors';
import { TYPOGRAPHY } from '@constants/typography';

interface CategoryChipProps {
  label: string;
  isSelected?: boolean;
  onPress: () => void;
}

export const CategoryChip: React.FC<CategoryChipProps> = ({
  label,
  isSelected = false,
  onPress,
}) => {
  const { tc } = useAppTheme();
  return (
    <TouchableOpacity
      style={[
        styles.chip,
        { backgroundColor: isSelected ? COLORS.beachBlue : tc.surface, borderColor: isSelected ? COLORS.beachBlue : tc.border },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.label, { color: isSelected ? COLORS.white : tc.text }]}>
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
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
  },
  label: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'Nunito-Medium',
  },
});

export default CategoryChip;
