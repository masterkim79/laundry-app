import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StatusBar
} from 'react-native';

const SERVER_URL = 'https://laundry-server-6wqm.onrender.com/api/laundry/analyze';

export default function App() {
  const [activeTab, setActiveTab] = useState('env');

  const [appliance, setAppliance] = useState('');
  const [detergent, setDetergent] = useState('');

  const [stain, setStain] = useState('');
  const [label, setLabel] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const [history, setHistory] = useState([]);

  const handleSaveEnv = () => {
    Alert.alert('저장 완료', '세탁실 환경(세탁기 및 보유 세제)이 저장되었습니다.');
    setActiveTab('diag');
  };

  const handleAnalyze = async () => {
    if (!stain.trim() && !label.trim()) {
      Alert.alert('알림', '오염 상태나 케어라벨 정보를 입력해 주세요.');
      return;
    }

    setLoading(true);
    setResult('');

    try {
      const response = await fetch(SERVER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userDescription: `[오염상태]: \({stain} / [케어라벨]:\){label}`,
          userProfile: {
            washerType: appliance || '통돌이',
            detergents: detergent || '일반세제'
          }
        }),
      });

      const data = await response.json();
      if (data.analysis) {
        setResult(data.analysis);
      } else {
        setResult('진단 결과를 가져오지 못했습니다. 다시 시도해 주세요.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('오류', '서버 통신 중 문제가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = () => {
    if (!result) return;
    const newRecord = {
      id: Date.now().toString(),
      title: stain || '의류 세탁 진단',
      date: new Date().toLocaleDateString('ko-KR'),
      detail: result.substring(0, 60) + '...'
    };
    setHistory([newRecord, ...history]);
    Alert.alert('완료', '세탁 기록장에 저장되었습니다.');
    setActiveTab('hist');
  };

  return (
    
      
      
      
        👕 찰칵 AI 세탁 전문가
      

      
         setActiveTab('env')}>
          1. 세탁실 환경
        
         setActiveTab('diag')}>
          2. AI 세탁 진단
        
         setActiveTab('hist')}>
          3. 세탁 기록장
        
      

      
        {activeTab === 'env' && (
          
            🧺 보유 세탁기 / 건조기
            

            🧴 보유 세제 및 첨가제
            

            
              세탁실 환경 저장하기
            
          
        )}

        {activeTab === 'diag' && (
          
            🔍 오염 / 의류 상태
            

            🏷️ 케어라벨 정보
            

            
              {loading ? (
                
              ) : (
                ✨ AI 세탁 솔루션 받기
              )}
            

            {result !== '' && (
              
                📋 세탁설 정밀 처방 리포트
                {result}

                
                  ✅ 세탁 완료! 기록장에 보관하기
                
              
            )}
          
        )}

        {activeTab === 'hist' && (
          
            📖 완료된 세탁 히스토리
            {history.length === 0 ? (
              아직 완료된 세탁 기록이 없습니다.
            ) : (
              history.map((item) => (
                
                  👕 {item.title}
                  {item.date}
                  {item.detail}
                
              ))
            )}
          
        )}
      
    
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { backgroundColor: '#2563eb', padding: 16, alignItems: 'center' },
  headerTitle: { color: '#ffffff', fontSize: 18, fontWeight: 'bold' },
  tabContainer: { flexDirection: 'row', backgroundColor: '#ffffff', borderBottomWidth: 1, borderColor: '#e2e8f0' },
  tabButton: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  activeTab: { borderBottomWidth: 3, borderColor: '#2563eb' },
  tabText: { fontSize: 13, color: '#64748b' },
  activeTabText: { color: '#2563eb', fontWeight: 'bold' },
  content: { padding: 16 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#334155', marginTop: 12, marginBottom: 6 },
  input: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, padding: 12, fontSize: 13 },
  textArea: { height: 80, textAlignVertical: 'top' },
  primaryButton: { backgroundColor: '#2563eb', padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 16 },
  primaryButtonText: { color: '#ffffff', fontWeight: 'bold', fontSize: 15 },
  resultCard: { backgroundColor: '#ffffff', padding: 16, borderRadius: 12, marginTop: 20, borderWidth: 1, borderColor: '#bfdbfe' },
  resultTitle: { fontSize: 15, fontWeight: 'bold', color: '#1e40af', marginBottom: 8 },
  resultText: { fontSize: 13, color: '#334155', lineHeight: 20 },
  finishButton: { backgroundColor: '#10b981', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 12 },
  finishButtonText: { color: '#ffffff', fontWeight: 'bold', fontSize: 13 },
  emptyText: { textAlign: 'center', color: '#94a3b8', marginTop: 30, fontSize: 13 },
  historyCard: { backgroundColor: '#ffffff', padding: 12, borderRadius: 8, marginBottom: 8, borderWidth: 1, borderColor: '#e2e8f0' },
  historyTitle: { fontSize: 14, fontWeight: 'bold', color: '#1e293b' },
  historyDate: { fontSize: 10, color: '#94a3b8', marginVertical: 2 },
  historyDetail: { fontSize: 12, color: '#475569' }
});
