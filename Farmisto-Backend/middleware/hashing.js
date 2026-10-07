const bcrypt = require('bcryptjs');

const hashPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    } catch (error) {
        throw new Error(`Failed to hash password: ${error.message}`);
    }
};

const comparePassword = async (password, hashedPassword) => {
    try {
        return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
        throw new Error(`Failed to compare password: ${error.message}`);
    }
};

module.exports = { hashPassword, comparePassword };
