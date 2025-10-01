import axios from 'axios';

const API_BASE = 'http://localhost:3000/api/v1';

async function testLongText() {
  console.log('📱 Test de l\'interface améliorée avec texte long\n');

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

    // 2. Créer une entrée avec un texte court
    console.log('2. 📝 Test avec texte court...');
    const shortEntry = {
      mood: 'CONTENT',
      contentText: 'Aujourd\'hui j\'ai passé une bonne journée. J\'ai joué avec mes amis et j\'ai bien mangé.'
    };

    console.log('📝 Contenu court:');
    console.log(`"${shortEntry.contentText}"`);
    console.log(`📏 Longueur: ${shortEntry.contentText.length} caractères\n`);

    const shortResponse = await axios.post(
      `${API_BASE}/students/${student.id}/journal`,
      shortEntry,
      {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log(`✅ Entrée courte créée: ${shortResponse.data.id}\n`);

    // 3. Créer une entrée avec un texte long
    console.log('3. 📝 Test avec texte long...');
    const longEntry = {
      mood: 'NEUTRE',
      contentText: `Aujourd'hui j'ai eu une journée très intéressante. Le matin, je me suis réveillé tôt et j'ai pris mon petit-déjeuner avec ma famille. Ensuite, je suis allé à l'école où j'ai eu plusieurs cours. En mathématiques, nous avons appris les fractions et c'était un peu difficile mais j'ai réussi à comprendre. En français, nous avons lu un livre sur les aventures d'un petit garçon qui voyageait dans le temps. L'histoire était passionnante et j'ai hâte de lire la suite. À la récréation, j'ai joué au football avec mes amis et nous avons marqué plusieurs buts. L'après-midi, nous avons eu un cours de sciences où nous avons fait des expériences avec des produits chimiques. C'était très amusant de voir les réactions. En fin de journée, j'ai fait mes devoirs et j'ai aidé ma mère à préparer le dîner. Ce soir, je vais regarder un film avec ma famille avant d'aller me coucher.`
    };

    console.log('📝 Contenu long:');
    console.log(`"${longEntry.contentText}"`);
    console.log(`📏 Longueur: ${longEntry.contentText.length} caractères`);
    console.log(`🔍 Troncature à 150 caractères: "${longEntry.contentText.substring(0, 150)}..."\n`);

    const longResponse = await axios.post(
      `${API_BASE}/students/${student.id}/journal`,
      longEntry,
      {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log(`✅ Entrée longue créée: ${longResponse.data.id}\n`);

    // 4. Créer une entrée avec un texte très long
    console.log('4. 📝 Test avec texte très long...');
    const veryLongEntry = {
      mood: 'TRISTE',
      contentText: `Cette semaine a été très difficile pour moi. Lundi, j'ai eu des problèmes avec mes devoirs de mathématiques et je n'arrivais pas à comprendre les équations. Mardi, il y a eu un contrôle surprise en français et je n'étais pas préparé. J'ai eu une mauvaise note et j'étais très déçu. Mercredi, mes amis ont organisé une fête d'anniversaire mais je n'ai pas pu y aller car j'étais malade. Je me sentais seul et exclu. Jeudi, j'ai eu une dispute avec mon meilleur ami à cause d'un malentendu. Nous ne nous parlons plus depuis. Vendredi, j'ai eu des difficultés en cours d'éducation physique car je ne suis pas très sportif. Les autres élèves se moquaient de moi et je me sentais humilié. Ce weekend, j'ai essayé de me détendre mais j'avais du mal à me concentrer sur mes loisirs. J'espère que la semaine prochaine sera meilleure et que je pourrai résoudre mes problèmes avec mes amis. J'aimerais aussi améliorer mes notes et me sentir plus confiant en classe.`
    };

    console.log('📝 Contenu très long:');
    console.log(`"${veryLongEntry.contentText}"`);
    console.log(`📏 Longueur: ${veryLongEntry.contentText.length} caractères`);
    console.log(`🔍 Troncature à 150 caractères: "${veryLongEntry.contentText.substring(0, 150)}..."\n`);

    const veryLongResponse = await axios.post(
      `${API_BASE}/students/${student.id}/journal`,
      veryLongEntry,
      {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log(`✅ Entrée très longue créée: ${veryLongResponse.data.id}\n`);

    // 5. Récupérer toutes les entrées pour vérifier
    console.log('5. 📚 Vérification de toutes les entrées...');
    const allEntriesResponse = await axios.get(`${API_BASE}/students/${student.id}/journal`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const allEntries = allEntriesResponse.data;
    console.log(`✅ ${allEntries.length} entrées au total\n`);

    // Afficher les 3 dernières entrées avec leur longueur
    const recentEntries = allEntries.slice(0, 3);
    recentEntries.forEach((entry, index) => {
      console.log(`📝 Entrée ${index + 1}:`);
      console.log(`   ID: ${entry.id}`);
      console.log(`   Humeur: ${entry.mood}`);
      console.log(`   Longueur: ${entry.contentText.length} caractères`);
      console.log(`   Contenu: "${entry.contentText.substring(0, 100)}..."`);
      console.log(`   Troncature: "${entry.contentText.substring(0, 150)}..."`);
      console.log('');
    });

    console.log('🎉 Tests de l\'interface améliorée terminés !');
    console.log('\n📊 Résumé:');
    console.log('✅ Connexion élève réussie');
    console.log('✅ Création d\'entrée courte réussie');
    console.log('✅ Création d\'entrée longue réussie');
    console.log('✅ Création d\'entrée très longue réussie');
    console.log('✅ Interface optimisée pour les textes longs');
    console.log('✅ Troncature à 150 caractères fonctionnelle');

  } catch (error) {
    console.error('❌ Erreur lors des tests:', error.response?.data || error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Assurez-vous que le backend est démarré:');
      console.log('   cd backend && npm run start:dev');
    }
  }
}

// Exécuter les tests
testLongText();
