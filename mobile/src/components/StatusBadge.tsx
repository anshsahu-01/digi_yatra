import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, BorderRadius, Spacing } from '../theme';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

const getStatusConfig = (status: string) => {
  const lower = status.toLowerCase();
  if (lower === 'available' || lower === 'confirmed' || lower === 'completed') {
    return { bg: Colors.successMuted, color: Colors.success, label: status };
  }
  if (lower === 'low' || lower === 'upcoming') {
    return { bg: Colors.warningMuted, color: Colors.warning, label: status === 'Low' ? 'Low Availability' : status };
  }
  if (lower === 'busy' || lower === 'cancelled') {
    return { bg: Colors.errorMuted, color: Colors.error, label: status };
  }
  return { bg: Colors.infoMuted, color: Colors.info, label: status };
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm' }) => {
  const config = getStatusConfig(status);

  return (
    <View style={[styles.badge, { backgroundColor: config.bg }, size === 'md' && styles.md]}>
      <View style={[styles.dot, { backgroundColor: config.color }]} />
      <Text style={[styles.label, { color: config.color }, size === 'md' && styles.mdLabel]}>
        {config.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
    gap: 5,
  },
  md: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 5,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  label: {
    ...Typography.caption,
    fontWeight: '600',
  },
  mdLabel: {
    ...Typography.bodySmMedium,
  },
});

export default StatusBadge;
