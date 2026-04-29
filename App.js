import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Animated, Easing, SafeAreaView, Dimensions, StatusBar } from 'react-native';

const QUOTES = [
  "لا تنتظر الوقت المناسب، فهو لن يأتي أبداً. ابدأ الآن.",
  "النجاح ليس النهاية، والفشل ليس قاتلاً، بل الشجاعة لمواصلة الطريق هي ما يهم.",
  "تنفس بعمق، ودع كل القلق يرحل.",
  "السعادة ليست وجهة تصل إليها، بل هي طريقة سفر.",
  "الهدوء هو أقوى سلاح لمواجهة الفوضى.",
  "كل يوم هو فرصة جديدة لتكون نسخة أفضل من نفسك."
];

function QuoteScreen() {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const getNewQuote = () => {
    Animated.timing(fadeAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start(() => {
      let nextIndex = Math.floor(Math.random() * QUOTES.length);
      if (nextIndex === quoteIndex) nextIndex = (nextIndex + 1) % QUOTES.length;
      setQuoteIndex(nextIndex);
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
    });
  };

  return (
    <View style={styles.screen}>
      <Animated.View style={{ opacity: fadeAnim, paddingHorizontal: 30 }}>
        <Text style={styles.quoteText}>"{QUOTES[quoteIndex]}"</Text>
      </Animated.View>
      <TouchableOpacity style={styles.btn} onPress={getNewQuote}>
        <Text style={styles.btnText}>إلهام جديد</Text>
      </TouchableOpacity>
    </View>
  );
}

function BreathingScreen() {
  const [phase, setPhase] = useState('جاهز؟');
  const animValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let isMounted = true;
    const cycle = () => {
      if (!isMounted) return;
      setPhase('شهيق (4)');
      Animated.timing(animValue, { toValue: 1.8, duration: 4000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }).start(({ finished }) => {
        if (!finished || !isMounted) return;
        setPhase('حبس النفس (7)');
        setTimeout(() => {
          if (!isMounted) return;
          setPhase('زفير (8)');
          Animated.timing(animValue, { toValue: 1, duration: 8000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }).start(({ finished }) => {
            if (finished && isMounted) cycle(); 
          });
        }, 7000);
      });
    };
    cycle();
    return () => { isMounted = false; };
  }, []);

  return (
    <View style={styles.screen}>
      <Text style={styles.breatheTitle}>{phase}</Text>
      <View style={styles.breatheContainer}>
        <Animated.View style={[styles.circle, { transform: [{ scale: animValue }] }]} />
        <View style={styles.innerCircle} />
      </View>
    </View>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState('quote'); 

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Daily Zen</Text>
        <Text style={styles.headerSubtitle}>لحظة هدوء في يومك</Text>
      </View>
      <View style={styles.content}>
        {activeTab === 'quote' ? <QuoteScreen /> : <BreathingScreen />}
      </View>
      <View style={styles.tabBar}>
        <TouchableOpacity style={[styles.tabBtn, activeTab === 'quote' && styles.activeTab]} onPress={() => setActiveTab('quote')}>
          <Text style={[styles.tabText, activeTab === 'quote' && styles.activeTabText]}>الاقتباسات</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabBtn, activeTab === 'breathe' && styles.activeTab]} onPress={() => setActiveTab('breathe')}>
          <Text style={[styles.tabText, activeTab === 'breathe' && styles.activeTabText]}>التنفس</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  header: { alignItems: 'center', paddingTop: 60, paddingBottom: 20 },
  headerTitle: { fontSize: 28, fontWeight: '800', color: '#e2e8f0', letterSpacing: 1 },
  headerSubtitle: { fontSize: 14, color: '#94a3b8', marginTop: 5 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  screen: { flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center' },
  quoteText: { fontSize: 26, color: '#f8fafc', textAlign: 'center', lineHeight: 40, fontWeight: '600', fontStyle: 'italic' },
  btn: { marginTop: 50, paddingVertical: 14, paddingHorizontal: 30, backgroundColor: '#38bdf8', borderRadius: 30, elevation: 5 },
  btnText: { color: '#0f172a', fontSize: 16, fontWeight: '700' },
  breatheTitle: { fontSize: 24, color: '#e2e8f0', marginBottom: 60, fontWeight: '600' },
  breatheContainer: { justifyContent: 'center', alignItems: 'center', width: 200, height: 200 },
  circle: { position: 'absolute', width: 150, height: 150, borderRadius: 75, backgroundColor: 'rgba(56, 189, 248, 0.2)', borderWidth: 2, borderColor: 'rgba(56, 189, 248, 0.4)' },
  innerCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#38bdf8', elevation: 10 },
  tabBar: { flexDirection: 'row', justifyContent: 'center', paddingBottom: 40, paddingTop: 15, backgroundColor: '#1e293b', borderTopWidth: 1, borderTopColor: '#334155' },
  tabBtn: { paddingVertical: 12, paddingHorizontal: 40, borderRadius: 25, marginHorizontal: 10 },
  activeTab: { backgroundColor: 'rgba(56, 189, 248, 0.1)' },
  tabText: { color: '#94a3b8', fontSize: 16, fontWeight: '600' },
  activeTabText: { color: '#38bdf8' }
});
