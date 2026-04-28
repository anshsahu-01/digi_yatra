import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, BorderRadius, Spacing, Shadows } from '../theme';
import StatusBadge from './StatusBadge';
import { Booking } from '../api/bookings';
import { formatCurrency, formatDate } from '../utils';

interface BookingCardProps {
  booking: Booking;
  onPress?: () => void;
  onCancel?: () => void;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking, onPress, onCancel }) => {
  const canCancel = booking.status !== 'Cancelled' && booking.status !== 'Completed';

  return (
    <TouchableOpacity
      style={[styles.container, Shadows.sm]}
      onPress={onPress}
      activeOpacity={0.85}
      disabled={!onPress}
    >
      <View style={styles.topRow}>
        <View style={styles.iconContainer}>
          <Ionicons
            name={booking.status === 'Cancelled' ? 'close-circle' : 'calendar'}
            size={20}
            color={booking.status === 'Cancelled' ? Colors.error : Colors.primary}
          />
        </View>
        <View style={styles.info}>
          <Text style={styles.stationName} numberOfLines={1}>
            {booking.stationName || 'Station'}
          </Text>
          <Text style={styles.date}>{formatDate(booking.date)} • {booking.slot}</Text>
        </View>
        <StatusBadge status={booking.status} />
      </View>

      <View style={styles.detailsRow}>
        <View style={styles.detail}>
          <Ionicons name="flash-outline" size={14} color={Colors.textMuted} />
          <Text style={styles.detailText}>{booking.chargerType || booking.charger_type}</Text>
        </View>
        <View style={styles.detail}>
          <Ionicons name="battery-charging-outline" size={14} color={Colors.textMuted} />
          <Text style={styles.detailText}>{booking.energyNeeded || booking.energy_needed} kWh</Text>
        </View>
        <View style={styles.detail}>
          <Ionicons name="car-outline" size={14} color={Colors.textMuted} />
          <Text style={styles.detailText}>{booking.vehicleNumber || booking.vehicle_number}</Text>
        </View>
      </View>

      <View style={styles.bottomRow}>
        <Text style={styles.amount}>{formatCurrency(booking.amount)}</Text>
        {canCancel && onCancel && (
          <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
            <Ionicons name="close-circle-outline" size={16} color={Colors.error} />
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
  },
  stationName: {
    ...Typography.bodyMedium,
    color: Colors.text,
  },
  date: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: 2,
  },
  detailsRow: {
    flexDirection: 'row',
    gap: Spacing.base,
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    flexWrap: 'wrap',
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  amount: {
    ...Typography.h4,
    color: Colors.accent,
  },
  cancelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.errorMuted,
  },
  cancelText: {
    ...Typography.captionMedium,
    color: Colors.error,
  },
});

export default BookingCard;
