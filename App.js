import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';

const SERVER_URL = 'https://laundry-server-6wqm.onrender.com/api/laundry/analyze';

export default function App() {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleAnalyze = async () => {
    if (!description.trim()) {
      Alert.alert('알림', '세탁물 상태나 오염 내용을 입력해 주세요.');
      return;
    }

    setLoading(true);
    setResult('');

    try {
      const response = await fetch(SERVER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userDescription: description,
          imageBase64List: [],
          userProfile: { washerType: '통돌이' }
        }),
      });

      const data = await response.json();
      if (data.analysis) {
        setResult(data.analysis);
      } else {
        setResult('분석 결과를 가져오지 못했습니다.');
      }
    } catch (error) {
      Alert.alert('오류', '서버 통신 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    
      🧺 세탁 전문 AI 진단기
      
      세탁물 상태 및 궁금한 점:
      

      
        {loading ?  : AI 세탁 진단 받기}
      

      {result ? (
        
          💡 AI 진단 결과
          {result}
        
      ) : null}
    
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#f5f7fa', paddingTop: 60 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: '#333' },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#555' },
  input: { backgroundColor: '#fff', borderRadius: 10, padding: 15, height: 100, textAlignVertical: 'top', borderWidth: 1, borderColor: '#ddd', marginBottom: 20 },
  button: { backgroundColor: '#007AFF', padding: 16, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  resultBox: { marginTop: 25, backgroundColor: '#fff', padding: 20, borderRadius: 12, borderWidth: 1, borderColor: '#e1e4e8' },
  resultTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#007AFF' },
  resultText: { fontSize: 15, lineHeight: 22, color: '#333' },
});
