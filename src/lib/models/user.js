import db from '../db';
import bcrypt from 'bcryptjs';

// SIGNUP MODEL
export const createUser = (fullName, email, plainPassword, role, collegeName) => {
  try {
    const hash = bcrypt.hashSync(plainPassword, 10);
    
    const stmt = db.prepare(`
      INSERT INTO users (full_name, email, password_hash, role, college_name) 
      VALUES (?, ?, ?, ?, ?)
    `);
    
    const info = stmt.run(fullName, email, hash, role, collegeName);
    
    return { success: true, userId: info.lastInsertRowid };
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return { success: false, error: 'An account with this email already exists.' };
    }
    return { success: false, error: 'Database error occurred.' };
  }
};

// LOGIN MODEL
export const verifyUser = (email, plainPassword) => {
  try {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    const user = stmt.get(email);

    if (!user) return { success: false, error: 'Invalid email or password.' };

    const isValid = bcrypt.compareSync(plainPassword, user.password_hash);
    if (!isValid) return { success: false, error: 'Invalid email or password.' };

    // Return the role and college_name so the API can use it
    const { password_hash, ...safeUser } = user;
    return { success: true, user: safeUser };
  } catch (error) {
    return { success: false, error: 'Database error occurred.' };
  }
};