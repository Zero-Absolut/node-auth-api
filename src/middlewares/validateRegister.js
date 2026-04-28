import { body, validationResult } from "express-validator";

export const validateRules = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Nome necessário")
    .escape()
    .isLength({ min: 3 })
    .withMessage("Nome muito curto.")
    .isLength({ max: 60 })
    .withMessage("Nome muito longo."),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Necessário e-mail.")
    .isEmail()
    .withMessage("Formato de e-mail inválido.")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Senha necessária.")
    .isLength({ min: 8 })
    .withMessage("A senha deve conter no mínimo 8 caracteres.")
    .matches(/[A-Z]/)
    .withMessage("A senha deve conter ao menos uma letra maiúscula.")
    .matches(/[a-z]/)
    .withMessage("A senha deve conter ao menos uma letra minúscula.")
    .matches(/[0-9]/)
    .withMessage("A senha deve conter ao menos um numero")
    .matches(/[^A-Za-z0-9]/)
    .withMessage("A senha deve conter ao menos um caractere especial."),

  body("confirmPassword")
    .notEmpty()
    .withMessage("Necessário confirmar senha.")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("As senhas não conferem.");
      }
      return true;
    }),
];

export function validateRulesUser(req, res, next) {
  const erros = validationResult(req);
  if (!erros.isEmpty()) {
    return res.status(400).json({
      success: false,
      code: "VALIDATION_ERROR",
      errors: erros.array(),
    });
  }

  return next();
}
