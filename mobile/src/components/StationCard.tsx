import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, BorderRadius, Spacing, Shadows } from '../theme';
import StatusBadge from './StatusBadge';
import { Station } from '../api/stations';
import { useFavoritesStore } from '../store/favoritesStore';

interface StationCardProps {
  station: Station;
  onPress: () => void;
  distance?: string;
}

const StationCard: React.FC<StationCardProps> = ({ station, onPress, distance }) => {
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const fav = isFavorite(String(station.id));

  return (
    <TouchableOpacity
      style={[styles.container, Shadows.sm]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {/* Top row */}
      <View style={styles.topRow}>
        <View style={styles.iconContainer}>
          <Ionicons name="flash" size={20} color={Colors.accent} />
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.name} numberOfLines={1}>
            {station.name}
          </Text>
          <Text style={styles.city} numberOfLines={1}>
            <Ionicons name="location-outline" size={12} color={Colors.textMuted} />{' '}
            {station.address || station.city}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => toggleFavorite(String(station.id))}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name={fav ? 'heart' : 'heart-outline'}
            size={22}
            color={fav ? Colors.error : Colors.textMuted}
          />
        </TouchableOpacity>
      </View>

      {/* Tags row */}
      <View style={styles.tagsRow}>
        <StatusBadge status={station.availability || 'Available'} />
        {distance && (
          <View style={styles.distanceTag}>
            <Ionicons name="navigate-outline" size={12} color={Colors.primary} />
            <Text style={styles.distanceText}>{distance}</Text>
          </View>
        )}
        {station.source && station.source !== 'LOCAL' && (
          <View style={styles.sourceTag}>
            <Text style={styles.sourceText}>{station.source}</Text>
          </View>
        )}
      </View>

      {/* Details row */}
      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <Ionicons name="flash-outline" size={14} color={Colors.textMuted} />
          <Text style={styles.detailText}>
            {station.charger_types?.slice(0, 2).join(', ') || 'CCS2'}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="speedometer-outline" size={14} color={Colors.textMuted} />
          <Text style={styles.detailText}>{station.powerOutput || '60 kW'}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="wallet-outline" size={14} color={Colors.textMuted} />
          <Text style={styles.detailText}>₹{station.price_per_unit}/kWh</Text>
        </View>
      </View>

      {/* Bottom row */}
      <View style={styles.bottomRow}>
        <Text style={styles.slots}>
          <Text style={styles.slotsHighlight}>{station.available_slots}</Text>
          /{station.total_slots} slots
        </Text>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={14} color={Colors.warning} />
          <Text style={styles.rating}>{station.rating || '4.5'}</Text>
        </View>
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
    backgroundColor: Colors.accentMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    ...Typography.bodyMedium,
    color: Colors.text,
  },
  city: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: 2,
  },
  tagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.md,
    flexWrap: 'wrap',
  },
  distanceTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: Colors.primaryMuted,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  distanceText: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '600',
  },
  sourceTag: {
    backgroundColor: Colors.infoMuted,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  sourceText: {
    ...Typography.caption,
    color: Colors.info,
    fontWeight: '600',
  },
  detailsRow: {
    flexDirection: 'row',
    gap: Spacing.base,
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  detailItem: {
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
  slots: {
    ...Typography.bodySm,
    color: Colors.textSecondary,
  },
  slotsHighlight: {
    color: Colors.accent,
    fontWeight: '700',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    ...Typography.bodySmMedium,
    color: Colors.text,
  },
});

export default StationCard;
