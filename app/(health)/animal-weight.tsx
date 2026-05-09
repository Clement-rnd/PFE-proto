import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { ArrowLeft01Icon, HelpCircleIcon, ArrowUpRight01Icon } from '@hugeicons/core-free-icons';
import Svg, { Path, Line, Text as SvgText, Circle } from 'react-native-svg';
import { useState } from 'react';
import { usePets } from '../../src/data/petStore';
import { CONSULTATIONS } from '../../src/data/consultationsData';
import { colors } from '../../src/theme/colors';
import { AnimatedEntry } from '../../src/components/ui/AnimatedEntry';
import { ScreenBackground } from '../../src/components/ui/ScreenBackground';

// ── Chart ─────────────────────────────────────────────────────────────────────

const CHART_H = 160;
const PAD_L = 36;
const PAD_R = 12;
const PAD_T = 8;
const PAD_B = 24;

function LineChart({ width, data, labels, yMin, yMax }: {
  width: number; data: number[]; labels: string[]; yMin: number; yMax: number;
}) {
  if (width <= 0 || data.length === 0) return null;
  const plotW = width - PAD_L - PAD_R;
  const plotH = CHART_H - PAD_T - PAD_B;
  const n = data.length;
  const xFor = (i: number) => n === 1 ? PAD_L + plotW / 2 : PAD_L + (i / (n - 1)) * plotW;
  const yFor = (v: number) => PAD_T + plotH * (1 - (v - yMin) / (yMax - yMin));
  const pathD = data.map((v, i) => `${i === 0 ? 'M' : 'L'} ${xFor(i).toFixed(1)} ${yFor(v).toFixed(1)}`).join(' ');
  const yLabels = [yMin, Math.round((yMin + yMax) / 2), yMax];
  return (
    <Svg width={width} height={CHART_H}>
      {yLabels.map(v => (
        <Line key={v} x1={PAD_L} y1={yFor(v)} x2={width - PAD_R} y2={yFor(v)} stroke="#E8E8E8" strokeWidth={1} />
      ))}
      {yLabels.map(v => (
        <SvgText key={v} x={PAD_L - 4} y={yFor(v) + 4} fontSize={10} fill="#B2B2B2" textAnchor="end" fontWeight="300">{v}</SvgText>
      ))}
      {labels.map((label, i) => (
        <SvgText key={i} x={xFor(i)} y={CHART_H - 2} fontSize={10} fill="#B2B2B2" textAnchor="middle" fontWeight="300">{label}</SvgText>
      ))}
      {n > 1 && (
        <Path d={pathD} stroke={colors.primary.DEFAULT} strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      )}
      {data.map((v, i) => (
        <Circle key={i} cx={xFor(i)} cy={yFor(v)} r={3.5} fill={colors.primary.DEFAULT} />
      ))}
    </Svg>
  );
}

// ── Empty state chart ─────────────────────────────────────────────────────────

function EmptyChartIllustration() {
  const W = 195; const H = 76; const originX = 9; const originY = 68;
  const curvePath = `M ${originX + 18} ${originY - 4} C ${originX + 32} ${originY - 18}, ${originX + 50} ${originY - 36}, ${originX + 74} ${originY - 58}`;
  return (
    <Svg width={W} height={H}>
      <Line x1={originX} y1={originY - 46} x2={W} y2={originY - 46} stroke="#E8E8E8" strokeWidth={1} strokeDasharray="4,3" />
      <Line x1={originX} y1={originY - 23} x2={W} y2={originY - 23} stroke="#E8E8E8" strokeWidth={1} strokeDasharray="4,3" />
      <Line x1={originX} y1={0} x2={originX} y2={originY} stroke="#DCDCDC" strokeWidth={1.5} strokeDasharray="4,3" />
      <Line x1={originX} y1={originY} x2={W} y2={originY} stroke="#DCDCDC" strokeWidth={1.5} strokeDasharray="4,3" />
      <Path d={curvePath} stroke={colors.primary.DEFAULT} strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// ── Screen ────────────────────────────────────────────────────────────────────

export default function AnimalWeightScreen() {
  const { index } = useLocalSearchParams<{ index?: string }>();
  const petIndex = parseInt(index ?? '0', 10);
  const pets = usePets();
  const pet = pets[petIndex];
  const [chartWidth, setChartWidth] = useState(0);

  if (!pet) return null;

  // Newest-first (array order), only consultations with weight recorded
  const weightConsultations = CONSULTATIONS.filter(c => c.petIndex === petIndex && c.weight != null);
  const hasData = weightConsultations.length > 0;

  // Chart needs oldest-first
  const chartConsultations = [...weightConsultations].reverse();
  const chartData = chartConsultations.map(c => c.weight!);
  const chartLabels = chartConsultations.map(c => c.chartLabel ?? c.dateLabel);

  const dataMin = hasData ? Math.min(...chartData) : 0;
  const dataMax = hasData ? Math.max(...chartData) : 0;
  const spread = dataMax - dataMin || 4;
  const yMin = Math.floor(dataMin - spread * 0.5);
  const yMax = Math.ceil(dataMax + spread * 0.5);

  const latest = hasData ? weightConsultations[0] : null;
  const prev = weightConsultations.length >= 2 ? weightConsultations[1] : null;
  const trend = latest && prev ? +(latest.weight! - prev.weight!).toFixed(1) : null;

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <ScreenBackground />

      <AnimatedEntry delay={0}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <HugeiconsIcon icon={ArrowLeft01Icon} size={28} color={colors.neutral[900]} strokeWidth={1.5} />
          </Pressable>
          <Text style={styles.title}>Poids de {pet.name}</Text>
          <View style={{ width: 28 }} />
        </View>
      </AnimatedEntry>

      <ScrollView
        style={[styles.scroll, styles.body]}
        contentContainerStyle={[styles.scrollContent, !hasData && { flexGrow: 1 }]}
        showsVerticalScrollIndicator={false}
      >
        <AnimatedEntry delay={80}>
          <View style={styles.alertBanner}>
            <HugeiconsIcon icon={HelpCircleIcon} size={16} color="#39438D" strokeWidth={1.5} />
            {hasData ? (
              <Text style={styles.alertText}>Ces informations sont mises à jour uniquement par votre vétérinaire.</Text>
            ) : (
              <View style={{ flex: 1, gap: 8 }}>
                <Text style={styles.alertText}>Seul votre vétérinaire peut renseigner le poids de votre animal.</Text>
                <Text style={styles.alertText}>Pensez à prendre RDV pour un suivi régulier.</Text>
              </View>
            )}
          </View>
        </AnimatedEntry>

        {hasData ? (
          <>
            <AnimatedEntry delay={140}>
              <View style={styles.valueSection}>
                <Text style={styles.dateLabel}>Dernière mise à jour le {latest!.dateLabel}</Text>
                <View style={styles.valueRow}>
                  <View style={styles.valueNumberRow}>
                    <Text style={styles.valueNumber}>{latest!.weight}</Text>
                    <Text style={styles.valueUnit}>kg</Text>
                  </View>
                  {trend !== null && (
                    <View style={[styles.trendBadge, trend < 0 && { backgroundColor: '#FCEEF1' }]}>
                      <View style={trend < 0 ? { transform: [{ rotate: '90deg' }] } : undefined}>
                        <HugeiconsIcon icon={ArrowUpRight01Icon} size={14} color={trend >= 0 ? colors.success.DEFAULT : colors.primary.DEFAULT} strokeWidth={2} />
                      </View>
                      <Text style={[styles.trendText, trend < 0 && { color: colors.primary.DEFAULT }]}>
                        {trend >= 0 ? '+' : ''}{trend} kg
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </AnimatedEntry>

            <AnimatedEntry delay={200}>
              <View style={styles.chartSection}>
                <Text style={styles.sectionTitle}>Évolution du poids</Text>
                <View style={styles.chartCard}>
                  <View style={styles.chartArea} onLayout={(e) => setChartWidth(e.nativeEvent.layout.width)}>
                    <LineChart width={chartWidth} data={chartData} labels={chartLabels} yMin={yMin} yMax={yMax} />
                  </View>
                </View>
              </View>
            </AnimatedEntry>

            <AnimatedEntry delay={260}>
              <View style={styles.historySection}>
                <Text style={styles.sectionTitle}>Historique</Text>
                <View style={styles.historyList}>
                  {weightConsultations.map((c) => (
                    <View key={c.id} style={styles.historyRow}>
                      <View style={styles.historyIconBox}>
                        <HugeiconsIcon icon={c.icon} size={16} color={colors.neutral[700]} strokeWidth={1.5} />
                      </View>
                      <View style={styles.historyContent}>
                        <Text style={styles.historyTitle}>{c.title}</Text>
                        <Text style={styles.historyDetail}>{c.dateLabel} · {c.doctor}</Text>
                      </View>
                      <Text style={styles.historyValue}>{c.weight} kg</Text>
                    </View>
                  ))}
                </View>
              </View>
            </AnimatedEntry>
          </>
        ) : (
          <AnimatedEntry delay={140} style={{ flex: 1 }}>
            <View style={styles.emptyCard}>
              <EmptyChartIllustration />
              <Text style={styles.emptyTitle}>Pas encore de pesées</Text>
              <Text style={styles.emptyBody}>
                Le poids de {pet.name} sera renseigné par votre vétérinaire lors des consultations.
              </Text>
            </View>
          </AnimatedEntry>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: 'transparent' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    height: 44,
    gap: 8,
  },
  title: { flex: 1, fontSize: 20, fontWeight: '500', color: '#181818' },
  body: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 32, gap: 24 },

  alertBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#E5E8FA',
    borderWidth: 1,
    borderColor: '#8E9AF6',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 13,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 3,
  },
  alertText: { flex: 1, fontSize: 16, fontWeight: '300', color: '#39438D', lineHeight: 16 * 1.2 },

  valueSection: { gap: 12 },
  dateLabel: { fontSize: 16, fontWeight: '300', color: '#717171', lineHeight: 16 * 1.4 },
  valueRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  valueNumberRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 4 },
  valueNumber: { fontSize: 36, fontWeight: '700', color: '#181818', letterSpacing: 0.72 },
  valueUnit: { fontSize: 16, fontWeight: '300', color: '#717171', paddingBottom: 4 },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.success[50],
    borderRadius: 8,
    paddingHorizontal: 8,
    height: 24,
  },
  trendText: { fontSize: 16, fontWeight: '300', color: colors.success.DEFAULT },

  chartSection: { gap: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '500', color: '#717171', lineHeight: 16 * 1.4 },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    padding: 16,
  },
  chartArea: { width: '100%' },

  historySection: { gap: 12 },
  historyList: { gap: 24 },
  historyRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  historyIconBox: {
    width: 32,
    height: 32,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyContent: { flex: 1, gap: 8 },
  historyTitle: { fontSize: 16, fontWeight: '500', color: '#181818', lineHeight: 16 * 1.4 },
  historyDetail: { fontSize: 14, fontWeight: '300', color: '#717171', lineHeight: 14 * 1.2 },
  historyValue: { fontSize: 16, fontWeight: '500', color: '#4F4F4F', lineHeight: 16 * 1.4 },

  emptyCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    paddingHorizontal: 16,
    paddingVertical: 24,
    gap: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: { fontSize: 16, fontWeight: '500', color: '#181818', lineHeight: 16 * 1.4 },
  emptyBody: { fontSize: 16, fontWeight: '300', color: '#717171', lineHeight: 16 * 1.4, textAlign: 'center' },
});
