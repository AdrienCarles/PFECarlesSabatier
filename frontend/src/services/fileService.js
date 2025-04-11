import axiosInstance from "../api/axiosConfig";

/**
 * Service pour gérer les opérations liées aux fichiers
 */
const fileService = {
  /**
   * Prépare un FormData avec les données et fichiers
   * @param {Object} data - Données du formulaire
   * @param {Object} files - Objet avec les fichiers à ajouter {fieldName: fileObject}
   * @returns {FormData} - FormData préparée
   */
  prepareFormData: (data, files = {}) => {
    const formData = new FormData();
    
    // Ajouter les champs de données
    Object.keys(data).forEach(key => {
      formData.append(key, data[key]);
    });
    
    // Ajouter les fichiers
    Object.keys(files).forEach(fieldName => {
      if (files[fieldName]) {
        formData.append(fieldName, files[fieldName]);
      }
    });
    
    return formData;
  },
  
  /**
   * Effectue une requête POST avec support de fichiers
   * @param {String} url - URL de l'endpoint
   * @param {Object} data - Données du formulaire
   * @param {Object} files - Objet avec les fichiers à ajouter
   * @returns {Promise} - Promesse de la requête
   */
  postWithFiles: async (url, data, files = {}) => {
    const formData = fileService.prepareFormData(data, files);
    
    return axiosInstance.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  
  /**
   * Effectue une requête PUT avec support de fichiers
   * @param {String} url - URL de l'endpoint
   * @param {Object} data - Données du formulaire
   * @param {Object} files - Objet avec les fichiers à ajouter
   * @returns {Promise} - Promesse de la requête
   */
  putWithFiles: async (url, data, files = {}) => {
    const formData = fileService.prepareFormData(data, files);
    
    return axiosInstance.put(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
};

export default fileService;