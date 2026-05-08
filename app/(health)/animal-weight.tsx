import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
  ArrowLeft01Icon, HelpCircleIcon, ArrowUpRight01Icon,
  TapeMeasureIcon, StethoscopeIcon, InjectionIcon, WeightScaleIcon,
} from '@hugeicons/core-free-icons';
import Svg, { Path, Line, Text as SvgText, Circle } from 'react-native-svg';
import { useState } from 'react';
import { usePets } from '../../src/data/petStore';
import { colors } from '../../src/theme/colors';
import { AnimatedEntry } from '../../src/components/ui/AnimatedEntry';
import { ScreenBackground } from '../../src/components/ui/ScreenBackground';

// ── Chart ─────────────────────────────────────────────────────────────────────

const NAYA_DATA = [23, 25, 26.5, 27.5, 28.5, 29.5, 30, 30];
const BREED_DATA = [24, 26.5, 28.5, 30, 31.5, 32.5, 33, 33.5];
const MONTHS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû'];
const Y_MIN = 20;
const Y_MAX = 36;
const CHART_H = 160;
const PAD_L = 36;
const PAD_R = 12;
const PAD_T = 8;
const PAD_B = 24;

function LineChart({ width }: { width: number }) {
  if (width <= 0) return null;
  const plotW = width - PAD_L - PAD_R;
  const plotH = CHART_H - PAD_T - PAD_B;
  const xFor = (i: number) => PAD_L + (i / (NAYA_DATA.length - 1)) * plotW;
  const yFor = (v: number) => PAD_T + plotH * (1 - (v - Y_MIN) / (Y_MAX - Y_MIN));
  const toD = (data: number[]) =>
    data.map((v, i) => `${i === 0 ? 'M' : 'L'} ${xFor(i).toFixed(1)} ${yFor(v).toFixed(1)}`).join(' ');
  const yLabels = [20, 28, 36];
  const xLabels = [0, 2, 4, 6, 7];
  return (
    <Svg width={width} height={CHART_H}>
      {yLabels.map(v => (
        <Line key={v} x1={PAD_L} y1={yFor(v)} x2={width - PAD_R} y2={yFor(v)} stroke="#E8E8E8" strokeWidth={1} />
      ))}
      {yLabels.map(v => (
        <SvgText key={v} x={PAD_L - 4} y={yFor(v) + 4} fontSize={10} fill="#B2B2B2" textAnchor="end" fontWeight="300">{v}</SvgText>
      ))}
      {xLabels.map(i => (
        <SvgText key={i} x={xFor(i)} y={CHART_H - 2} fontSize={10} fill="#B2B2B2" textAnchor="middle" fontWeight="300">{MONTHS[i]}</SvgText>
      ))}
      <Path d={toD(BREED_DATA)} stroke="#DCDCDC" strokeWidth={2} fill="none" strokeDasharray="5,4" />
      <Path d={toD(NAYA_DATA)} stroke={colors.primary.DEFAULT} strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {NAYA_DATA.map((v, i) => (
        <Circle key={i} cx={xFor(i)} cy={yFor(v)} r={3.5} fill={colors.primary.DEFAULT} />
      ))}
    </Svg>
  );
}

function LegendDash() {
  return (
    <Svg width={12} height={2}>
      <Line x1={0} y1={1} x2={12} y2={1} stroke="#DCDCDC" strokeWidth={2} strokeDasharray="3,2" />
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

// ── History ───────────────────────────────────────────────────────────────────

type HistoryEntry = { icon: any; title: string; detail: string; value: string };

const HISTORY: HistoryEntry[] = [
  { icon: StethoscopeIcon, title: 'Bilan annuel',          detail: '8 avr. 2026 · Dr. Martin',  value: '30 kg' },
  { icon: WeightScaleIcon, title: 'Pesée vétérinaire',     detail: '12 jan. 2026 · Dr. Martin', value: '29.5 kg' },
  { icon: InjectionIcon,   title: 'Vaccin annuel + pesée', detail: '3 sep. 2025 · Dr. Dupont',  value: '28 kg' },
  { icon: TapeMeasureIcon, title: 'Consultation',           detail: '21 mai 2025 · Dr. Dupont',  value: '26 kg' },
];

function HistoryRow({ entry }: { entry: HistoryEntry }) {
  return (
    <View style={styles.historyRow}>
      <View style={styles.historyIconBox}>
        <HugeiconsIcon icon={entry.icon} size={16} color={colors.neutral[700]} strokeWidth={1.5} />
      </View>
      <View style={styles.historyContent}>
        <Text style={styles.historyTitle}>{entry.title}</Text>
        <Text style={styles.historyDetail}>{entry.detail}</Text>
      </View>
      <Text style={styles.historyValue}>{entry.value}</Text>
    </View>
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

  const hasData = petIndex === 0;

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
        {/* Alert */}
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
            {/* Valeur courante — flat, pas de card */}
            <AnimatedEntry delay={140}>
              <View style={styles.valueSection}>
                <Text style={styles.dateLabel}>Dernière mise à jour le 8 avril 2026</Text>
                <View style={styles.valueRow}>
                  <View style={styles.valueNumberRow}>
                    <Text style={styles.valueNumber}>30</Text>
                    <Text style={styles.valueUnit}>kg</Text>
                  </View>
                  <View style={styles.trendBadge}>
                    <HugeiconsIcon icon={ArrowUpRight01Icon} size={14} color={colors.success.DEFAULT} strokeWidth={2} />
                    <Text style={styles.trendText}>+0.5 kg</Text>
                  </View>
                </View>
              </View>
            </AnimatedEntry>

            {/* Chart — titre en dehors de la card */}
            <AnimatedEntry delay={200}>
              <View style={styles.chartSection}>
                <Text style={styles.sectionTitle}>Évolution du poids</Text>
                <View style={styles.chartCard}>
                  <View style={styles.legend}>
                    <View style={styles.legendItem}>
                      <View style={[styles.legendLineSolid, { backgroundColor: colors.primary.DEFAULT }]} />
                      <Text style={styles.legendLabel}>{pet.name}</Text>
                    </View>
                    <View style={styles.legendItem}>
                      <LegendDash />
                      <Text style={styles.legendLabel}>Moyenne de la race</Text>
                    </View>
                  </View>
                  <View style={styles.chartArea} onLayout={(e) => setChartWidth(e.nativeEvent.layout.width)}>
                    <LineChart width={chartWidth} />
                  </View>
                </View>
              </View>
            </AnimatedEntry>

            {/* Historique — pas de card */}
            <AnimatedEntry delay={260}>
              <View style={styles.historySection}>
                <Text style={styles.sectionTitle}>Historique</Text>
                <View style={styles.historyList}>
                  {HISTORY.map((entry, i) => <HistoryRow key={i} entry={entry} />)}
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

  // Valeur courante — flat
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

  // Chart section
  chartSection: { gap: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '500', color: '#717171', lineHeight: 16 * 1.4 },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    padding: 16,
    gap: 24,
  },
  legend: { flexDirection: 'row', gap: 24 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  legendLineSolid: { width: 12, height: 2, borderRadius: 1 },
  legendLabel: { fontSize: 12, fontWeight: '300', color: '#717171' },
  chartArea: { width: '100%' },

  // History — pas de card
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

  // Empty state
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
