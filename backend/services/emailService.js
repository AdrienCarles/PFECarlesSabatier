import nodemailer from 'nodemailer';

// Configuration du transporteur email
const createTransporter = () => {
  if (process.env.SMTP_HOST === 'smtp.gmail.com') {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

export const sendActivationEmail = async ({
  email,
  nom,
  prenom,
  activationToken,
  enfantNom,
}) => {
  try {
    const transporter = createTransporter();
    await transporter.verify();

    const activationUrl = `${process.env.FRONTEND_URL}/activate/${activationToken}`;
    const destinataireEmail = process.env.TEST_EMAIL_RECIPIENT;


    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Activation de votre compte parent</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #007bff; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f8f9fa; }
          .button { 
            display: inline-block; 
            padding: 12px 24px; 
            background: #28a745; 
            color: white; 
            text-decoration: none; 
            border-radius: 5px;
            margin: 20px 0;
          }
          .footer { padding: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Activation de votre compte parent</h1>
          </div>
          
          <div class="content">
            <h2>Bonjour ${prenom} ${nom},</h2>
            
            <p>Votre orthophoniste a créé un compte pour vous permettre de suivre les progrès de ${enfantNom || 'votre enfant'}.</p>
            
            <p><strong>Pour activer votre compte :</strong></p>
            <ol>
              <li>Cliquez sur le bouton ci-dessous</li>
              <li>Créez votre mot de passe personnel</li>
              <li>Connectez-vous à votre espace parent</li>
            </ol>
            
            <div style="text-align: center;">
              <a href="${activationUrl}" class="button">
                🔑 Activer mon compte
              </a>
            </div>
            
            <p><strong>Ou copiez ce lien dans votre navigateur :</strong><br>
            ${activationUrl}</p>
            
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p><strong>⏰ Important :</strong> Ce lien d'activation expire dans 24 heures.</p>
            </div>
            
            <h3>📱 Avec votre compte, vous pourrez :</h3>
            <ul>
              <li>Consulter les exercices de votre enfant</li>
              <li>Voir ses progrès et statistiques</li>
              <li>Communiquer avec votre orthophoniste</li>
              <li>Télécharger des rapports de suivi</li>
            </ul>
          </div>
          
          <div class="footer">
            <p>Si vous n'arrivez pas à activer votre compte, contactez votre orthophoniste.</p>
            <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"Plateforme Orthophonie" <${process.env.SMTP_USER}>`,
      to: destinataireEmail,
      subject: 'Activez votre compte parent - Plateforme Orthophonie',
      html: htmlContent,
    };

    const result = await transporter.sendMail(mailOptions);

    return result;
  } catch (error) {
    throw new Error("Erreur lors de l'envoi de l'email d'activation");
  }
};

export const sendPasswordResetEmail = async ({
  email,
  nom,
  prenom,
  resetToken,
}) => {
  // Fonction pour envoyer un email de réinitialisation (optionnel)
  // À implémenter si nécessaire
};
