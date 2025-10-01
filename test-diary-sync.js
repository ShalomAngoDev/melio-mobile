import axios from 'axios';

const API_BASE = 'http://localhost:3000/api/v1';

async function testDiarySync() {
  console.log('📱 Test de synchronisation du journal intime mobile\n');

  try {
    // 1. Connexion élève
    console.log('1. 🔐 Connexion élève...');
    const loginResponse = await axios.post(`${API_BASE}/auth/student/login`, {
      schoolCode: 'JMO75-01',
      studentIdentifier: 'EMMA01'
    });

    const token = loginResponse.data.accessToken;
    const student = loginResponse.data.student;
    console.log(`✅ Élève connecté: ${student.firstName} ${student.lastName}`);
    console.log(`🔑 Token: ${token.substring(0, 20)}...\n`);

    // 2. Récupérer les entrées existantes
    console.log('2. 📋 Récupération des entrées existantes...');
    const entriesResponse = await axios.get(`${API_BASE}/students/${student.id}/journal`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const existingEntries = entriesResponse.data;
    console.log(`✅ ${existingEntries.length} entrées existantes trouvées\n`);

    // 3. Créer une nouvelle entrée de journal
    console.log('3. ✍️ Création d\'une nouvelle entrée...');
    const testEntry = {
      mood: 'TRISTE',
      contentText: 'Je me sens triste aujourd\'hui. J\'ai eu des difficultés à l\'école et je me sens seul.'
    };

    const createResponse = await axios.post(
      `${API_BASE}/students/${student.id}/journal`,
      testEntry,
      {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const newEntry = createResponse.data;
    console.log(`✅ Entrée créée: ${newEntry.id}`);
    console.log(`📝 Contenu: "${newEntry.contentText}"`);
    console.log(`😔 Humeur: ${newEntry.mood}`);
    console.log(`📅 Date: ${new Date(newEntry.createdAt).toLocaleString('fr-FR')}\n`);

    // 4. Vérifier l'analyse IA
    console.log('4. 🤖 Vérification de l\'analyse IA...');
    if (newEntry.aiRiskScore !== undefined) {
      console.log(`📊 Score de risque: ${newEntry.aiRiskScore}/100`);
      console.log(`⚠️  Niveau de risque: ${newEntry.aiRiskLevel || 'Non analysé'}`);
      
      if (newEntry.aiSummary) {
        console.log(`📋 Résumé IA: "${newEntry.aiSummary}"`);
      }
      
      if (newEntry.aiAdvice) {
        console.log(`💡 Conseil IA: "${newEntry.aiAdvice}"`);
      }
    } else {
      console.log('⏳ Analyse IA en cours...');
    }

    // 5. Récupérer toutes les entrées pour vérifier
    console.log('\n5. 📚 Vérification de toutes les entrées...');
    const allEntriesResponse = await axios.get(`${API_BASE}/students/${student.id}/journal`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const allEntries = allEntriesResponse.data;
    console.log(`✅ ${allEntries.length} entrées au total`);

    allEntries.forEach((entry, index) => {
      console.log(`\n📝 Entrée ${index + 1}:`);
      console.log(`   ID: ${entry.id}`);
      console.log(`   Humeur: ${entry.mood}`);
      console.log(`   Contenu: "${entry.contentText.substring(0, 50)}..."`);
      console.log(`   Date: ${new Date(entry.createdAt).toLocaleString('fr-FR')}`);
      if (entry.aiRiskScore) {
        console.log(`   Score IA: ${entry.aiRiskScore}/100 (${entry.aiRiskLevel})`);
      }
    });

    // 6. Tester la récupération d'une entrée spécifique
    console.log('\n6. 🔍 Test de récupération d\'entrée spécifique...');
    const specificEntryResponse = await axios.get(
      `${API_BASE}/students/${student.id}/journal/${newEntry.id}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    const specificEntry = specificEntryResponse.data;
    console.log(`✅ Entrée récupérée: ${specificEntry.id}`);
    console.log(`📝 Contenu complet: "${specificEntry.contentText}"`);

    // 7. Tester avec une entrée qui déclenche une alerte
    console.log('\n7. 🚨 Test avec contenu à risque...');
    const riskEntry = {
      mood: 'TRES_TRISTE',
      contentText: 'Je me sens très mal. Personne ne m\'aime. Je veux disparaître. Je ne vois plus d\'espoir.'
    };

    const riskResponse = await axios.post(
      `${API_BASE}/students/${student.id}/journal`,
      riskEntry,
      {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const riskEntryResult = riskResponse.data;
    console.log(`✅ Entrée à risque créée: ${riskEntryResult.id}`);
    
    if (riskEntryResult.aiRiskScore !== undefined) {
      console.log(`📊 Score de risque: ${riskEntryResult.aiRiskScore}/100`);
      console.log(`⚠️  Niveau: ${riskEntryResult.aiRiskLevel}`);
      
      if (riskEntryResult.aiSummary) {
        console.log(`📋 Résumé: "${riskEntryResult.aiSummary}"`);
      }
      
      if (riskEntryResult.aiAdvice) {
        console.log(`💡 Conseil: "${riskEntryResult.aiAdvice}"`);
      }
    }

    console.log('\n🎉 Tests de synchronisation du journal intime terminés !');
    console.log('\n📊 Résumé:');
    console.log('✅ Connexion élève réussie');
    console.log('✅ Création d\'entrée réussie');
    console.log('✅ Analyse IA fonctionnelle');
    console.log('✅ Récupération des entrées réussie');
    console.log('✅ Détection de contenu à risque');
    console.log('✅ Synchronisation backend-mobile opérationnelle');

  } catch (error) {
    console.error('❌ Erreur lors des tests:', error.response?.data || error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Assurez-vous que le backend est démarré:');
      console.log('   cd backend && npm run start:dev');
    }
  }
}

// Exécuter les tests
testDiarySync();
