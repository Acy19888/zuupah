/**
 * ConfirmModal
 * On-brand confirmation dialog — replaces the ugly native Alert.
 */
import React from 'react';
import {
  Modal, View, Text, StyleSheet,
  TouchableOpacity, TouchableWithoutFeedback,
  Animated, useRef,
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useAppTheme } from '@hooks/useAppTheme';
import { COLORS } from '@constants/colors';
import { TYPOGRAPHY } from '@constants/typography';

interface Props {
  visible: boolean;
  icon?: string;
  iconColor?: string;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  infoOnly?: boolean;   // hides cancel button, shows single OK button
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<Props> = ({
  visible,
  icon = 'alert-circle-outline',
  iconColor,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = false,
  infoOnly = false,
  onConfirm,
  onCancel,
}) => {
  const { tc, isDark } = useAppTheme();
  const confirmColor = destructive ? COLORS.error : COLORS.beachBlue;
  const resolvedIconColor = iconColor ?? confirmColor;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onCancel}
    >
      {/* Dim backdrop — tap to dismiss */}
      <TouchableWithoutFeedback onPress={onCancel}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      {/* Card */}
      <View style={styles.centerer} pointerEvents="box-none">
        <View style={[styles.card, { backgroundColor: tc.card }]}>
          {/* Icon badge */}
          <View style={[styles.iconBadge, { backgroundColor: resolvedIconColor + '18' }]}>
            <Icon name={icon as any} size={32} color={resolvedIconColor} />
          </View>

          {/* Text */}
          <Text style={[styles.title, { color: tc.text }]}>{title}</Text>
          <Text style={[styles.message, { color: tc.textSecondary }]}>{message}</Text>

          {/* Divider */}
          <View style={[styles.divider, { backgroundColor: tc.border }]} />

          {/* Buttons */}
          <View style={styles.buttons}>
            {!infoOnly && (
              <TouchableOpacity
                style={[styles.btn, styles.cancelBtn, { borderColor: tc.border, backgroundColor: tc.surface }]}
                onPress={onCancel}
                activeOpacity={0.75}
              >
                <Text style={[styles.btnText, { color: tc.textSecondary }]}>{cancelLabel}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.btn, styles.confirmBtn, { backgroundColor: confirmColor }]}
              onPress={onConfirm}
              activeOpacity={0.8}
            >
              <Text style={[styles.btnText, styles.confirmBtnText]}>{confirmLabel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  centerer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  card: {
    width: '100%',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 12,
  },
  iconBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontFamily: 'Nunito-Bold',
    textAlign: 'center',
  },
  message: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'Nunito-Regular',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 4,
  },
  divider: {
    width: '100%',
    height: 1,
    marginVertical: 4,
  },
  buttons: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  btn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtn: {
    borderWidth: 1.5,
  },
  confirmBtn: {},
  btnText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: 'Nunito-Bold',
  },
  confirmBtnText: {
    color: '#fff',
  },
});

export default ConfirmModal;
