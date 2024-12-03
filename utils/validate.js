exports.validatePassword = async (password, confirmPassword) => {
    const regex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{6,16}$/;

    const isValid = regex.test(password);
  
    if (!isValid) {
      return { success: false, message: 'Password should at least have 1 number, 1 lowercase letter, 1 uppercase letter, 1 special character, no space, and it must be 6-16 characters long.' };
    }
  
    if (password !== confirmPassword) {
      return { success: false, message: 'Passwords do not match.' };
    }
  
    return { success: true };
  };

