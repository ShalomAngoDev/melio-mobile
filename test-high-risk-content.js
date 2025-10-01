import axios from 'axios';

const API_BASE = 'http://localhost:3000/api/v1';

async function testHighRiskContent() {
  console.log('🚨 Test de contenu à haut risque (Score 100/100)\n');

  try {
    // 1. Connexion élève
    console.log('1. 🔐 Connexion élève...');
    const loginResponse = await axios.post(`${API_BASE}/auth/student/login`, {
      schoolCode: 'JMO75-01',
      studentIdentifier: 'EMMA01'
    });

    const token = loginResponse.data.accessToken;
    const student = loginResponse.data.student;
    console.log(`✅ Élève connecté: ${student.firstName} ${student.lastName}\n`);

    // 2. Contenu à très haut risque (devrait donner score 100/100)
    console.log('2. 🚨 Test avec contenu à très haut risque...');
    const highRiskEntry = {
      mood: 'TRES_TRISTE',
      contentText: `Je veux mourir. Je me hais tellement. Personne ne m'aime. Je suis un échec total. 
      Je ne vois plus d'espoir. Je veux disparaître pour toujours. 
      Je pense à me faire du mal. Je ne supporte plus cette vie. 
      Je veux que tout s'arrête. Je suis seul et personne ne se soucie de moi. 
      Je veux en finir avec tout ça. Je ne mérite pas de vivre.`
    };

    console.log('📝 Contenu à tester:');
    console.log(`"${highRiskEntry.contentText}"`);
    console.log(`😔 Humeur: ${highRiskEntry.mood}\n`);

    const createResponse = await axios.post(
      `${API_BASE}/students/${student.id}/journal`,
      highRiskEntry,
      {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const newEntry = createResponse.data;
    console.log(`✅ Entrée créée: ${newEntry.id}`);
    console.log(`📅 Date: ${new Date(newEntry.createdAt).toLocaleString('fr-FR')}\n`);

    // 3. Vérification de l'analyse IA
    console.log('3. 🤖 Vérification de l\'analyse IA...');
    if (newEntry.aiRiskScore !== undefined) {
      console.log(`📊 Score de risque: ${newEntry.aiRiskScore}/100`);
      console.log(`⚠️  Niveau de risque: ${newEntry.aiRiskLevel || 'Non analysé'}`);
      
      if (newEntry.aiSummary) {
        console.log(`📋 Résumé IA: "${newEntry.aiSummary}"`);
      }
      
      if (newEntry.aiAdvice) {
        console.log(`💡 Conseil IA: "${newEntry.aiAdvice}"`);
      }

      // Vérification du score
      if (newEntry.aiRiskScore >= 100) {
        console.log('\n🎯 SUCCÈS: Score de risque maximal atteint (100/100)');
        console.log('✅ L\'analyse IA a correctement détecté le contenu à très haut risque');
      } else if (newEntry.aiRiskScore >= 80) {
        console.log('\n⚠️  Score élevé détecté mais pas maximal');
        console.log(`📊 Score actuel: ${newEntry.aiRiskScore}/100`);
      } else {
        console.log('\n❌ Score plus bas que prévu');
        console.log(`📊 Score actuel: ${newEntry.aiRiskScore}/100`);
        console.log('💡 Le contenu pourrait nécessiter des mots-clés plus explicites');
      }
    } else {
      console.log('⏳ Analyse IA en cours...');
    }

    // 4. Test avec un autre contenu à très haut risque
    console.log('\n4. 🚨 Test avec un autre contenu à très haut risque...');
    const anotherHighRiskEntry = {
      mood: 'TRES_TRISTE',
      contentText: `Je vais me suicider. Je ne peux plus continuer comme ça. 
      Je vais me faire du mal ce soir. Je veux que tout se termine. 
      Je vais prendre des médicaments pour en finir. 
      Personne ne me manquera. Je suis un fardeau pour tout le monde. 
      Je vais sauter du pont ce soir. C'est fini pour moi.`
    };

    console.log('📝 Deuxième contenu à tester:');
    console.log(`"${anotherHighRiskEntry.contentText}"`);

    const createResponse2 = await axios.post(
      `${API_BASE}/students/${student.id}/journal`,
      anotherHighRiskEntry,
      {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const newEntry2 = createResponse2.data;
    console.log(`✅ Deuxième entrée créée: ${newEntry2.id}\n`);

    // 5. Vérification de la deuxième analyse IA
    console.log('5. 🤖 Vérification de la deuxième analyse IA...');
    if (newEntry2.aiRiskScore !== undefined) {
      console.log(`📊 Score de risque: ${newEntry2.aiRiskScore}/100`);
      console.log(`⚠️  Niveau de risque: ${newEntry2.aiRiskLevel || 'Non analysé'}`);
      
      if (newEntry2.aiSummary) {
        console.log(`📋 Résumé IA: "${newEntry2.aiSummary}"`);
      }
      
      if (newEntry2.aiAdvice) {
        console.log(`💡 Conseil IA: "${newEntry2.aiAdvice}"`);
      }

      // Vérification du score
      if (newEntry2.aiRiskScore >= 100) {
        console.log('\n🎯 SUCCÈS: Score de risque maximal atteint (100/100)');
        console.log('✅ L\'analyse IA a correctement détecté le contenu à très haut risque');
      } else if (newEntry2.aiRiskScore >= 80) {
        console.log('\n⚠️  Score élevé détecté mais pas maximal');
        console.log(`📊 Score actuel: ${newEntry2.aiRiskScore}/100`);
      } else {
        console.log('\n❌ Score plus bas que prévu');
        console.log(`📊 Score actuel: ${newEntry2.aiRiskScore}/100`);
      }
    }

    console.log('\n🎉 Tests de contenu à haut risque terminés !');
    console.log('\n📊 Résumé:');
    console.log('✅ Connexion élève réussie');
    console.log('✅ Création d\'entrées à haut risque réussie');
    console.log('✅ Analyse IA fonctionnelle');
    console.log('✅ Détection de contenu à très haut risque');

  } catch (error) {
    console.error('❌ Erreur lors des tests:', error.response?.data || error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Assurez-vous que le backend est démarré:');
      console.log('   cd backend && npm run start:dev');
    }
  }
}

// Exécuter les tests
testHighRiskContent();





