import mysql2 from 'mysql2/promise';
import dotenv from 'dotenv';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

// Charger les variables d'environnement
dotenv.config();

async function diagnoseConnection() {
    console.log('\n🔍 DIAGNOSTIC DE CONNEXION MYSQL');
    console.log('=====================================');
    
    // 1. Vérifier les variables d'environnement
    console.log('\n📋 Configuration actuelle:');
    console.log(`   DB_HOST: ${process.env.DB_HOST || 'localhost'}`);
    console.log(`   DB_PORT: ${process.env.DB_PORT || '3306'}`);
    console.log(`   DB_USER: ${process.env.DB_USER || 'root'}`);
    console.log(`   DB_PASSWORD: ${process.env.DB_PASSWORD ? '***défini***' : '❌ NON DÉFINI'}`);
    console.log(`   DB_NAME: ${process.env.DB_NAME || 'pfe'}`);
    
    // 2. Vérifier si MySQL est en cours d'exécution
    console.log('\n🚀 Vérification des services MySQL...');
    try {
        // Vérifier les processus MySQL
        const { stdout: processes } = await execPromise('tasklist /FI "IMAGENAME eq mysqld.exe"');
        if (processes.includes('mysqld.exe')) {
            console.log('✅ Service MySQL (mysqld.exe) est en cours d\'exécution');
        } else {
            console.log('❌ Service MySQL (mysqld.exe) n\'est PAS en cours d\'exécution');
        }
        
        // Vérifier les ports en écoute
        const { stdout: netstat } = await execPromise('netstat -an | findstr :3306');
        if (netstat.includes(':3306')) {
            console.log('✅ Port 3306 est en écoute');
            console.log(`   Détails: ${netstat.trim()}`);
        } else {
            console.log('❌ Port 3306 n\'est PAS en écoute');
        }
    } catch (error) {
        console.log('⚠️  Impossible de vérifier les services:', error.message);
    }
    
    // 3. Tester la connexion avec différentes configurations
    console.log('\n🔌 Tests de connexion...');
    
    const configs = [
        {
            name: 'Configuration .env',
            config: {
                host: process.env.DB_HOST || 'localhost',
                port: parseInt(process.env.DB_PORT) || 3306,
                user: process.env.DB_USER || 'root',
                password: process.env.DB_PASSWORD || ''
            }
        },
        {
            name: 'Configuration par défaut XAMPP',
            config: {
                host: 'localhost',
                port: 3306,
                user: 'root',
                password: ''
            }
        },
        {
            name: 'Configuration 127.0.0.1',
            config: {
                host: '127.0.0.1',
                port: 3306,
                user: 'root',
                password: ''
            }
        }
    ];
    
    for (const { name, config } of configs) {
        console.log(`\n📡 Test: ${name}`);
        console.log(`   Host: ${config.host}:${config.port}`);
        console.log(`   User: ${config.user}`);
        
        try {
            const connection = await mysql2.createConnection({
                ...config,
                connectTimeout: 5000,
                acquireTimeout: 5000,
                timeout: 5000
            });
            
            const [result] = await connection.execute('SELECT VERSION() as version');
            console.log(`   ✅ SUCCÈS - MySQL version: ${result[0].version}`);
            
            // Tester l'accès à la base de données
            try {
                await connection.execute(`USE ${process.env.DB_NAME || 'pfe'}`);
                console.log(`   ✅ Base de données '${process.env.DB_NAME || 'pfe'}' accessible`);
            } catch (dbError) {
                console.log(`   ⚠️  Base de données '${process.env.DB_NAME || 'pfe'}' non accessible:`, dbError.message);
            }
            
            await connection.end();
            break; // Si une config fonctionne, on s'arrête
            
        } catch (error) {
            console.log(`   ❌ ÉCHEC: ${error.code || error.message}`);
            
            if (error.code === 'ECONNREFUSED') {
                console.log('      → Connexion refusée - MySQL probablement arrêté');
            } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
                console.log('      → Accès refusé - mauvais utilisateur/mot de passe');
            } else if (error.code === 'ENOTFOUND') {
                console.log('      → Hôte non trouvé - vérifiez l\'adresse');
            }
        }
    }
    
    // 4. Recommandations
    console.log('\n💡 RECOMMANDATIONS:');
    console.log('=====================================');
    console.log('1. Vérifiez que XAMPP est démarré');
    console.log('2. Ouvrez le panneau de contrôle XAMPP');
    console.log('3. Démarrez le service MySQL si nécessaire');
    console.log('4. Vérifiez que le port 3306 n\'est pas utilisé par autre chose');
    console.log('5. Essayez de vous connecter avec phpMyAdmin pour confirmer');
}

// Exécuter le diagnostic
diagnoseConnection().catch(console.error);