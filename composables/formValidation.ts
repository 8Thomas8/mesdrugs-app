export const useFormValidation = () => {
  const required = (value: string | number) => {
    if (!value && value !== 0) {
      return 'Champs requis.'
    }
    return true
  }

  const email = (value: string) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailPattern.test(value)) {
      return 'Adresse email invalide.'
    }
    return true
  }

  const password = (value: string) => {
    const emailPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    if (!emailPattern.test(value)) {
      return 'Le mot de passe doit contenir au moins 8 caractères dont 1 lettre majuscule, 1 lettre minuscule, 1 chiffre et 1 caractère spécial.'
    }
    return true
  }

  const passwordConfirmation = (value: string, password: string) => {
    if (value !== password) {
      return 'La confirmation du mot de passe doit être identique au mot de passe.'
    }
    return true
  }

  const isFloat = (value: string) => {
    const floatPattern = /^\d+(\.\d{1,2})?$/
    if (!floatPattern.test(value)) {
      return 'Veuillez entrer un nombre valide.'
    }
    return true
  }

  const isDate = (value: string) => {
    const dateFormat = /^\d{2}\/\d{2}\/\d{4}$/
    if (!dateFormat.test(value)) {
      return 'Veuillez entrer une date valide.'
    }
  }

  return {
    required,
    email,
    password,
    passwordConfirmation,
    isFloat,
    isDate,
  }
}
