import { FaEdit, FaTrashAlt, FaCog, FaCheckCircle } from "react-icons/fa";
import { HiMiniSquaresPlus } from "react-icons/hi2";

export const useTableActions = () => {
  const createEditAction = (onEdit, title = "Modifier") => ({
    icon: FaEdit,
    variant: "outline-primary",
    title,
    onClick: (item) => onEdit(item)
  });

  const createDeleteAction = (onDelete, title = "Supprimer", condition = null) => ({
    icon: FaTrashAlt,
    variant: "outline-danger",
    title,
    condition,
    onClick: (item) => onDelete(item)
  });

  const createConfigAction = (onConfig, title = "Configurer", condition = null) => ({
    icon: FaCog,
    variant: "outline-info",
    title,
    condition,
    onClick: (item) => onConfig(item)
  });

  const createValidateAction = (onValidate, title = "Valider", condition = null) => ({
    icon: FaCheckCircle,
    variant: "outline-success",
    title,
    condition,
    onClick: (item) => onValidate(item)
  });

  const createAnimationAction = (onAnimation, title = "Gestion des animations", condition = null) => ({
    icon: HiMiniSquaresPlus,
    variant: "outline-info",
    title,
    condition,
    onClick: (item) => onAnimation(item)
  });

  return {
    createEditAction,
    createDeleteAction,
    createConfigAction,
    createValidateAction,
    createAnimationAction
  };
};