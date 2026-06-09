import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useRef, useState, useCallback } from 'react';

export default function CameraScreen() {
  const router = useRouter();
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [flash, setFlash] = useState(false);
  const shutterScale = useRef(new Animated.Value(1)).current;

  const handlePressIn = useCallback(() => {
    longPressTimer.current = setTimeout(() => {
      // 长按快门2秒 → 进入验证界面
      longPressTimer.current = null;
      router.push('/verify');
    }, 2000);
  }, [router]);

  const handlePressOut = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
      // 短按 → 假拍照闪光
      setFlash(true);
      Animated.sequence([
        Animated.timing(shutterScale, { toValue: 0.85, duration: 80, useNativeDriver: true }),
        Animated.timing(shutterScale, { toValue: 1, duration: 80, useNativeDriver: true }),
      ]).start();
      setTimeout(() => setFlash(false), 200);
    }
  }, [shutterScale]);

  return (
    <View style={styles.container}>
      {/* 闪光效果 */}
      {flash && <View style={styles.flashOverlay} />}

      {/* 顶部工具栏 */}
      <View style={styles.topBar}>
        <Text style={styles.topIcon}>⚡</Text>
        <Text style={styles.topIcon}>ℹ️</Text>
      </View>

      {/* 取景器 */}
      <View style={styles.viewfinder}>
        <View style={styles.viewfinderInner}>
          {/* 四角标记 */}
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />

          {/* 中心对焦框 */}
          <View style={styles.crosshair}>
            <View style={styles.crosshairH} />
            <View style={styles.crosshairV} />
          </View>
        </View>
      </View>

      {/* 底部控制区 */}
      <View style={styles.bottomBar}>
        {/* 假相册按钮 */}
        <View style={styles.galleryThumb}>
          <Text style={styles.galleryIcon}>🖼️</Text>
        </View>

        {/* 快门按钮 - 长按2秒进入隐藏验证 */}
        <Pressable
          style={styles.shutterOuter}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <Animated.View style={[styles.shutterInner, { transform: [{ scale: shutterScale }] }]} />
        </Pressable>

        {/* 假翻转摄像头 */}
        <View style={styles.flipBtn}>
          <Text style={styles.flipIcon}>🔄</Text>
        </View>
      </View>

      {/* 假模式选择 */}
      <View style={styles.modeBar}>
        <Text style={styles.modeText}>延时摄影</Text>
        <Text style={styles.modeText}>慢动作</Text>
        <Text style={[styles.modeText, styles.modeActive]}>照片</Text>
        <Text style={styles.modeText}>视频</Text>
        <Text style={styles.modeText}>全景</Text>
      </View>
    </View>
  );
}

const CORNER_LEN = 24;
const CORNER_W = 3;
const ACCENT = '#FFCC00';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'space-between',
  },
  flashOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#fff',
    opacity: 0.7,
    zIndex: 99,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 12,
  },
  topIcon: {
    fontSize: 22,
    color: '#fff',
  },
  viewfinder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  viewfinderInner: {
    width: '100%',
    aspectRatio: 3 / 4,
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: 4,
  },
  corner: {
    position: 'absolute',
    width: CORNER_LEN,
    height: CORNER_LEN,
    borderColor: ACCENT,
  },
  topLeft: {
    top: -1, left: -1,
    borderTopWidth: CORNER_W, borderLeftWidth: CORNER_W,
    borderTopLeftRadius: 4,
  },
  topRight: {
    top: -1, right: -1,
    borderTopWidth: CORNER_W, borderRightWidth: CORNER_W,
    borderTopRightRadius: 4,
  },
  bottomLeft: {
    bottom: -1, left: -1,
    borderBottomWidth: CORNER_W, borderLeftWidth: CORNER_W,
    borderBottomLeftRadius: 4,
  },
  bottomRight: {
    bottom: -1, right: -1,
    borderBottomWidth: CORNER_W, borderRightWidth: CORNER_W,
    borderBottomRightRadius: 4,
  },
  crosshair: {
    position: 'absolute',
    top: '50%', left: '50%',
    transform: [{ translateX: -20 }, { translateY: -20 }],
  },
  crosshairH: {
    width: 40, height: 1,
    backgroundColor: 'rgba(255,204,0,0.5)',
    position: 'absolute',
    top: 20,
  },
  crosshairV: {
    width: 1, height: 40,
    backgroundColor: 'rgba(255,204,0,0.5)',
    position: 'absolute',
    left: 20,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 24,
  },
  galleryThumb: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  galleryIcon: {
    fontSize: 20,
  },
  shutterOuter: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shutterInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#fff',
  },
  flipBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flipIcon: {
    fontSize: 20,
  },
  modeBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    paddingBottom: 40,
  },
  modeText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
  },
  modeActive: {
    color: ACCENT,
    fontWeight: '600',
  },
});
