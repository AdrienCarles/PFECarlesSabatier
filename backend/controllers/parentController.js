import { USR } from '../models/index.js';
import AppError from '../utils/AppError.js';

const parentController = {
  getChildrenOfParent: async (req, res, next) => {
    try {
      const parentId = req.user.id; // supposé extrait du JWT via middleware
      const children = await USR.findAll({
        where: {
          USR_parent_id: parentId,
          USR_role: 'enfant'
        },
        attributes: ['USR_id', 'USR_prenom']
      });

      res.json(children);
    } catch (error) {
      next(new AppError(500, 'Erreur lors de la récupération des enfants'));
    }
  }
};

export default parentController;
