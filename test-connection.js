// Script de test de connexion mobile
import axios from 'axios';

const API_BASE_URL = 'http://192.168.1.107:3000/api/v1';

async function testConnection() {
  console.log('🔍 Test de connexion mobile...');
  
  try {
    // Test 1: Health check
    console.log('1. Test health check...');
    const healthResponse = await axios.get(`${API_BASE_URL}/health`);
    console.log('✅ Health check:', healthResponse.data);
    
    // Test 2: Student login
    console.log('2. Test student login...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/student/login`, {
      schoolCode: 'JMO75-01',
      studentIdentifier: 'EMMA01'
    });
    console.log('✅ Student login:', loginResponse.data);
    
    // Test 3: Student profile
    console.log('3. Test student profile...');
    const profileResponse = await axios.get(`${API_BASE_URL}/students/${loginResponse.data.student.id}`, {
      headers: {
        'Authorization': `Bearer ${loginResponse.data.accessToken}`
      }
    });
    console.log('✅ Student profile:', profileResponse.data);
    
    console.log('🎉 Tous les tests de connexion sont réussis !');
    
  } catch (error) {
    console.error('❌ Erreur de connexion:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

testConnection();
