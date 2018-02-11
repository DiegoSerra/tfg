export const authTypes = ['twitter', 'facebook', 'google', 'linkedin'];

export const validateEmptyEmail = (email) => {
  if (authTypes.indexOf(this.provider) !== -1) {
    return true;
  }
  return email.length;
};

export const validateEmptyPassword = (hashedPassword) => {
  if (authTypes.indexOf(this.provider) !== -1) {
    return true;
  }
  return hashedPassword.length;
};
