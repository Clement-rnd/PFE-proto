import {
  View,
  Text,
  Pressable,
  Modal,
  Animated,
  Easing,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { Camera01Icon, Image03Icon } from '@hugeicons/core-free-icons';
import { SquircleView } from 'react-native-figma-squircle';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '../../theme/colors';

interface PhotoPickerSheetProps {
  visible: boolean;
  onClose: () => void;
  onPhoto: (uri: string) => void;
}

export function PhotoPickerSheet({ visible, onClose, onPhoto }: PhotoPickerSheetProps) {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(80)).current;
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (visible) {
      setModalVisible(true);
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 260,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          damping: 28,
          stiffness: 100,
          mass: 1.2,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 220,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 80,
          duration: 220,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (finished) setModalVisible(false);
      });
    }
  }, [visible]);

  async function handleCamera() {
    onClose();
    // Wait for the close animation (220ms) + a small buffer before launching
    await new Promise(r => setTimeout(r, 350));
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') return;
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      onPhoto(result.assets[0].uri);
    }
  }

  async function handleLibrary() {
    onClose();
    await new Promise(r => setTimeout(r, 350));
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      onPhoto(result.assets[0].uri);
    }
  }

  const bottomPadding = Math.max(insets.bottom, 16);

  return (
    <Modal visible={modalVisible} transparent animationType="none" onRequestClose={onClose}>
      <Pressable style={StyleSheet.absoluteFillObject} onPress={onClose} />

      <Animated.View style={[styles.backdrop, { opacity }]} pointerEvents="none" />

      <Animated.View
        style={[
          styles.container,
          { paddingBottom: bottomPadding, transform: [{ translateY }] },
        ]}
      >
        {/* Main card */}
        <View style={styles.card}>
          <SquircleView
            squircleParams={{ cornerRadius: 16, cornerSmoothing: 1, fillColor: '#fafafa' }}
            style={StyleSheet.absoluteFillObject}
            pointerEvents="none"
          />
          <Pressable style={styles.option} onPress={handleCamera}>
            <HugeiconsIcon icon={Camera01Icon} size={22} color={colors.neutral[700]} strokeWidth={1.5} />
            <Text style={styles.optionText}>Prendre une photo</Text>
          </Pressable>
          <View style={styles.separator} />
          <Pressable style={styles.option} onPress={handleLibrary}>
            <HugeiconsIcon icon={Image03Icon} size={22} color={colors.neutral[700]} strokeWidth={1.5} />
            <Text style={styles.optionText}>Choisir dans la bibliothèque</Text>
          </Pressable>
        </View>

        {/* Cancel card */}
        <Pressable style={styles.cancelCard} onPress={onClose}>
          <SquircleView
            squircleParams={{ cornerRadius: 16, cornerSmoothing: 1, fillColor: '#fafafa' }}
            style={StyleSheet.absoluteFillObject}
            pointerEvents="none"
          />
          <Text style={styles.cancelText}>Annuler</Text>
        </Pressable>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(9,10,10,0.5)',
  },
  container: {
    position: 'absolute',
    bottom: 0,
    left: 16,
    right: 16,
    gap: 8,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    paddingHorizontal: 16,
    gap: 12,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#181818',
  },
  separator: {
    height: 1,
    backgroundColor: '#E8E8E8',
    marginHorizontal: 16,
  },
  cancelCard: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#181818',
  },
});
