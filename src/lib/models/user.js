import db from '../db';
import bcrypt from 'bcryptjs';




export const createUser = (fullName, email, plainPassword) => {
  try {
    
    const hash = bcrypt.hashSync(plainPassword, 10);
    
    
    const stmt = db.prepare(`
      INSERT INTO users (full_name, email, password_hash) 
      VALUES (?, ?, ?)
    `);
    
    const info = stmt.run(fullName, email, hash);
    
    return { success: true, userId: info.lastInsertRowid };
  } catch (error) {
    
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return { success: false, error: 'An account with this email already exists.' };
    }
    return { success: false, error: 'Database error occurred.' };
  }
};




export const verifyUser = (email, plainPassword) => {
  try {
    
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    const user = stmt.get(email);

    
    if (!user) {
      return { success: false, error: 'Invalid email or password.' };
    }

    
    const isValid = bcrypt.compareSync(plainPassword, user.password_hash);
    
    if (!isValid) {
      return { success: false, error: 'Invalid email or password.' };
    }

    
    
    const { password_hash, ...safeUser } = user;
    
    return { success: true, user: safeUser };
  } catch (error) {
    return { success: false, error: 'Database error occurred.' };
  }
};