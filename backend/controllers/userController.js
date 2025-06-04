import crypto from 'crypto';
import bcrypt from 'bcrypt';
import AppError from '../utils/AppError.js';
import { USR, ENFA, ABM, ANI, SES, RefreshToken } from '../models/index.js';
import { sendActivationEmail } from '../services/emailService.js';

const userController = {
  getAllUsers: async (req, res, next) => {
    try {
      const { role } = req.query;
      const whereClause = role ? { USR_role: role } : {};

      const users = await USR.findAll({
        where: whereClause,
        attributes: { exclude: ['USR_pass', 'USR_activationToken'] },
      });

      res.json(users);
    } catch (error) {
      next(
        new AppError(500, 'Erreur lors de la récupération des utilisateurs')
      );
    }
  },

  getUserById: async (req, res, next) => {
    try {
      const user = await USR.findByPk(req.params.usrId, {
        include: [
          { model: ENFA, as: 'enfantsParent' },
          { model: ENFA, as: 'enfantsOrthophoniste' },
          { model: ABM, as: 'abonnements' },
          { model: SES, as: 'series' },
          { model: ANI, as: 'animations' },
        ],
      });
      if (!user) {
        return next(new AppError(404, 'Utilisateur non trouvé'));
      }
      res.json(user);
    } catch (error) {
      next(
        new AppError(500, "Erreur lors de la récupération de l'utilisateur")
      );
    }
  },

  createUser: async (req, res, next) => {
    try {
      if (
        req.user &&
        req.user.role === 'orthophoniste' &&
        req.body.USR_role !== 'parent'
      ) {
        return next(
          new AppError(
            403,
            'Les orthophonistes peuvent uniquement créer des comptes parent'
          )
        );
      }

      let hashedPassword = null;
      let activationToken = null;

      if (req.body.USR_role === 'parent') {
        const tempPassword = crypto.randomBytes(12).toString('hex');
        hashedPassword = await bcrypt.hash(tempPassword, 10);

        activationToken = crypto.randomBytes(32).toString('hex');

        req.body.USR_statut = 'inactif';
        req.body.USR_activationToken = activationToken;
        req.body.USR_tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
      } else {
        if (!req.body.USR_pass) {
          return next(new AppError(400, 'Mot de passe requis'));
        }
        hashedPassword = await bcrypt.hash(req.body.USR_pass, 10);
      }

      const user = await USR.create({
        ...req.body,
        USR_pass: hashedPassword,
        USR_dateCreation: new Date(),
      });

      // Envoyer l'email d'activation pour les parents
      if (req.body.USR_role === 'parent' && activationToken) {
        try {
          await sendActivationEmail({
            email: user.USR_email,
            nom: user.USR_nom,
            prenom: user.USR_prenom,
            activationToken: activationToken,
          });
        } catch (emailError) {
          console.error('Erreur envoi email:', emailError);
        }
      }

      const userResponse = { ...user.toJSON() };
      delete userResponse.USR_pass;
      delete userResponse.USR_activationToken;

      res.status(201).json(userResponse);
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        return next(new AppError(400, `Données invalides: ${error.message}`));
      } else if (error.name === 'SequelizeUniqueConstraintError') {
        return next(new AppError(400, `Email déjà utilisé`));
      } else if (error.name === 'SequelizeForeignKeyConstraintError') {
        return next(new AppError(400, `Référence invalide`));
      }

      next(new AppError(500, `Erreur: ${error.message}`));
    }
  },

  createPatientComplete: async (req, res, next) => {
    const transaction = await USR.sequelize.transaction();

    try {
      const { parentData, childData, orthophonisteId } = req.body;

      if (
        req.user &&
        req.user.role === 'orthophoniste' &&
        req.user.id !== orthophonisteId
      ) {
        await transaction.rollback();
        return next(
          new AppError(
            403,
            'Vous ne pouvez créer des patients que pour vous-même'
          )
        );
      }

      // Générer un mot de passe temporaire et un token d'activation
      const tempPassword = crypto.randomBytes(12).toString('hex');
      const hashedPassword = await bcrypt.hash(tempPassword, 10);
      const activationToken = crypto.randomBytes(32).toString('hex');

      const parent = await USR.create(
        {
          ...parentData,
          USR_pass: hashedPassword,
          USR_role: 'parent',
          USR_statut: 'inactif',
          USR_activationToken: activationToken,
          USR_tokenExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h
          USR_dateCreation: new Date(),
        },
        { transaction }
      );

      const enfant = await ENFA.create(
        {
          ...childData,
          ENFA_dateCreation: new Date(),
          USR_parent_id: parent.USR_id,
          USR_orthophoniste_id: orthophonisteId,
        },
        { transaction }
      );

      await transaction.commit();

      // Envoyer l'email d'activation
      try {
        await sendActivationEmail({
          email: parent.USR_email,
          nom: parent.USR_nom,
          prenom: parent.USR_prenom,
          activationToken: activationToken,
          enfantNom: `${enfant.ENFA_prenom} ${enfant.ENFA_nom}`,
        });
      } catch (emailError) {
        console.error('Erreur envoi email:', emailError);
      }

      const parentResponse = { ...parent.toJSON() };
      delete parentResponse.USR_pass;
      delete parentResponse.USR_activationToken;

      res.status(201).json({
        parent: parentResponse,
        enfant: enfant,
        message:
          "Patient créé avec succès. Un email d'activation a été envoyé au parent.",
      });
    } catch (error) {
      await transaction.rollback();
      console.error('Erreur création patient complet:', error);

      if (error.name === 'SequelizeValidationError') {
        return next(new AppError(400, `Données invalides: ${error.message}`));
      } else if (error.name === 'SequelizeUniqueConstraintError') {
        return next(new AppError(400, `Email déjà utilisé`));
      }

      next(
        new AppError(
          500,
          `Erreur lors de la création du patient: ${error.message}`
        )
      );
    }
  },

  validateActivationToken: async (req, res, next) => {
    try {
      const { token } = req.params;

      const user = await USR.findOne({
        where: {
          USR_activationToken: token,
          USR_role: 'parent',
          USR_statut: 'inactif',
        },
        attributes: ['USR_id', 'USR_nom', 'USR_prenom', 'USR_email', 'USR_tokenExpiry']
      });

      if (!user) {
        return next(new AppError(400, "Token d'activation invalide"));
      }

      // Vérifier si le token n'est pas expiré
      if (user.USR_tokenExpiry && new Date() > user.USR_tokenExpiry) {
        return next(new AppError(400, "Token d'activation expiré"));
      }

      res.json({
        message: 'Token valide',
        user: {
          nom: user.USR_nom,
          prenom: user.USR_prenom,
          email: user.USR_email
        }
      });
    } catch (error) {
      next(new AppError(500, "Erreur lors de la validation du token"));
    }
  },

  activateParentAccount: async (req, res, next) => {
    try {
      const { token } = req.params;
      const { newPassword } = req.body;

      if (!newPassword || newPassword.length < 6) {
        return next(
          new AppError(
            400,
            'Le mot de passe doit contenir au moins 6 caractères'
          )
        );
      }

      // Trouver l'utilisateur avec le token
      const user = await USR.findOne({
        where: {
          USR_activationToken: token,
          USR_role: 'parent',
          USR_statut: 'inactif',
        },
      });

      if (!user) {
        return next(new AppError(400, "Token d'activation invalide ou expiré"));
      }

      // Vérifier si le token n'est pas expiré
      if (user.USR_tokenExpiry && new Date() > user.USR_tokenExpiry) {
        return next(new AppError(400, "Token d'activation expiré"));
      }

      // Hasher le nouveau mot de passe
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Mettre à jour l'utilisateur
      await user.update({
        USR_pass: hashedPassword,
        USR_statut: 'actif',
        USR_activationToken: null,
        USR_tokenExpiry: null,
      });

      res.json({
        message: 'Compte activé avec succès. Vous pouvez maintenant vous connecter.',
      });
    } catch (error) {
      next(new AppError(500, "Erreur lors de l'activation du compte"));
    }
  },

  updateUser: async (req, res, next) => {
    try {
      const user = await USR.findByPk(req.params.usrId);
      if (!user) {
        return next(new AppError(404, 'Utilisateur non trouvé'));
      }
      await user.update(req.body);
      res.json(user);
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        return next(new AppError(400, 'Données de mise à jour invalides'));
      }
      next(new AppError(500, "Erreur lors de la mise à jour de l'utilisateur"));
    }
  },

  deleteUser: async (req, res, next) => {
    try {
      const user = await USR.findByPk(req.params.usrId);
      if (!user) {
        return next(new AppError(404, 'Utilisateur non trouvé'));
      }

      await RefreshToken.destroy({
        where: { USR_id: user.USR_id },
      });

      await user.destroy();

      res.json({ message: 'Utilisateur supprimé avec succès' });
    } catch (error) {
      if (error.name === 'SequelizeForeignKeyConstraintError') {
        return next(
          new AppError(
            400,
            "Impossible de supprimer cet utilisateur car il est référencé par d'autres données"
          )
        );
      }

      next(new AppError(500, "Erreur lors de la suppression de l'utilisateur"));
    }
  },
};

export default userController;
