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

// ── Chart (full state) ────────────────────────────────────────────────────────

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
        <SvgText key={v} x={PAD_L - 4} y={yFor(v) + 4} fontSize={10} fill="#B2B2B2" textAnchor="end" fontWeight="300">
          {v}
        </SvgText>
      ))}
      {xLabels.map(i => (
        <SvgText key={i} x={xFor(i)} y={CHART_H - 2} fontSize={10} fill="#B2B2B2" textAnchor="middle" fontWeight="300">
          {MONTHS[i]}
        </SvgText>
      ))}
      <Path d={toD(BREED_DATA)} stroke="#DCDCDC" strokeWidth={2} fill="none" strokeDasharray="5,4" />
      <Path d={toD(NAYA_DATA)} stroke={colors.primary.DEFAULT} strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {NAYA_DATA.map((v, i) => (
        <Circle key={i} cx={xFor(i)} cy={yFor(v)} r={3.5} fill={colors.primary.DEFAULT} />
      ))}
    </Svg>
  );
}

// ── Chart illustration (empty state) ─────────────────────────────────────────

function EmptyChartIllustration() {
  const W = 195;
  const H = 76;
  const originX = 9;
  const originY = 68;

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

// ── History (full state) ──────────────────────────────────────────────────────

type HistoryEntry = { icon: any; iconBg: string; title: string; detail: string; value: string };

const HISTORY: HistoryEntry[] = [
  { icon: StethoscopeIcon, iconBg: '#E5E8FA', title: 'Bilan annuel',          detail: '8 avr. 2026 · Dr. Martin',  value: '30 kg' },
  { icon: WeightScaleIcon, iconBg: '#FEF0F2', title: 'Pesée vétérinaire',     detail: '12 jan. 2026 · Dr. Martin', value: '29.5 kg' },
  { icon: InjectionIcon,   iconBg: '#F0FDF4', title: 'Vaccin annuel + pesée', detail: '3 sep. 2025 · Dr. Dupont',  value: '28 kg' },
  { icon: TapeMeasureIcon, iconBg: '#FFF7ED', title: 'Consultation',           detail: '21 mai 2025 · Dr. Dupont',  value: '26 kg' },
];

function HistoryRow({ entry, last }: { entry: HistoryEntry; last: boolean }) {
  return (
    <>
      <View style={styles.historyRow}>
        <ScreenBackground />
        <View style={[styles.historyIconBox, { backgroundColor: entry.iconBg }]}>
          <HugeiconsIcon icon={entry.icon} size={20} color={colors.neutral[900]} strokeWidth={1.5} />
        </View>
        <View style={styles.historyContent}>
          <Text style={styles.historyTitle}>{entry.title}</Text>
          <Text style={styles.historyDetail}>{entry.detail}</Text>
        </View>
        <Text style={styles.historyValue}>{entry.value}</Text>
      </View>
      {!last && <View style={styles.divider} />}
    </>
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
        {/* Info banner */}
        <AnimatedEntry delay={80}>
          <View style={styles.alertBanner}>
            <HugeiconsIcon icon={HelpCircleIcon} size={16} color="#39438D" strokeWidth={1.5} />
            {hasData ? (
              <Text style={styles.alertText}>
                Ces informations sont mises à jour uniquement par votre vétérinaire.
              </Text>
            ) : (
              <View style={{ flex: 1, gap: 8 }}>
                <Text style={styles.alertText}>
                  Seul votre vétérinaire peut renseigner le poids de votre animal.
                </Text>
                <Text style={styles.alertText}>
                  Pensez à prendre RDV pour un suivi régulier.
                </Text>
              </View>
            )}
          </View>
        </AnimatedEntry>

        {hasData ? (
          <>
            {/* Current value card */}
            <AnimatedEntry delay={140}>
              <View style={styles.card}>
                <Text style={styles.cardDateLabel}>Dernière mise à jour le 8 avril 2026</Text>
                <View style={styles.valueRow}>
                  <Text style={styles.valueText}>30 kg</Text>
                  <View style={styles.trendBadge}>
                    <HugeiconsIcon icon={ArrowUpRight01Icon} size={14} color="#16A34A" strokeWidth={2} />
                    <Text style={styles.trendText}>+0.5 kg</Text>
                  </View>
                </View>
              </View>
            </AnimatedEntry>

            {/* Chart card */}
            <AnimatedEntry delay={200}>
              <View style={styles.chartCard}>
                <Text style={styles.chartTitle}>Évolution du poids</Text>
                <View style={styles.chartArea} onLayout={(e) => setChartWidth(e.nativeEvent.layout.width)}>
                  <LineChart width={chartWidth} />
                </View>
                <View style={styles.legend}>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendLine, { backgroundColor: colors.primary.DEFAULT }]} />
                    <Text style={styles.legendLabel}>{pet.name}</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendLine, { backgroundColor: '#DCDCDC' }]} />
                    <Text style={styles.legendLabel}>Moyenne de la race</Text>
                  </View>
                </View>
              </View>
            </AnimatedEntry>

            {/* History */}
            <AnimatedEntry delay={260}>
              <View style={styles.historySection}>
                <Text style={styles.historySectionTitle}>Historique</Text>
                <View style={styles.historyCard}>
                  {HISTORY.map((entry, i) => (
                    <HistoryRow key={i} entry={entry} last={i === HISTORY.length - 1} />
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
  scrollContent: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 32, gap: 16 },

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
  },
  alertText: {
    fontSize: 16,
    fontWeight: '300',
    color: '#39438D',
    lineHeight: 16 * 1.2,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    padding: 16,
    gap: 8,
  },
  cardDateLabel: { fontSize: 12, fontWeight: '300', color: '#B2B2B2' },
  valueRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  valueText: { fontSize: 40, fontWeight: '500', color: '#181818', lineHeight: 48 },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  trendText: { fontSize: 14, fontWeight: '500', color: '#16A34A' },

  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    padding: 16,
    gap: 12,
  },
  chartTitle: { fontSize: 16, fontWeight: '500', color: '#181818' },
  chartArea: { width: '100%' },
  legend: { flexDirection: 'row', gap: 16 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendLine: { width: 16, height: 2, borderRadius: 1 },
  legendLabel: { fontSize: 12, fontWeight: '300', color: '#717171' },

  historySection: { gap: 12 },
  historySectionTitle: { fontSize: 16, fontWeight: '500', color: '#717171', lineHeight: 16 * 1.4 },
  historyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    overflow: 'hidden',
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  historyIconBox: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  historyContent: { flex: 1, gap: 2 },
  historyTitle: { fontSize: 16, fontWeight: '400', color: '#181818' },
  historyDetail: { fontSize: 12, fontWeight: '300', color: '#B2B2B2' },
  historyValue: { fontSize: 16, fontWeight: '500', color: '#181818' },
  divider: { height: 1, backgroundColor: '#DCDCDC', marginHorizontal: 16 },

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
  emptyTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#181818',
    lineHeight: 16 * 1.4,
  },
  emptyBody: {
    fontSize: 16,
    fontWeight: '300',
    color: '#717171',
    lineHeight: 16 * 1.4,
    textAlign: 'center',
  },
});
