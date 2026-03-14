import db from '../db';
import bcrypt from 'bcryptjs';

// ==========================================
// 1. SIGNUP MODEL (Create a new user)
// ==========================================
export const createUser = (fullName, email, plainPassword) => {
  try {
    // Hash the password before saving it
    const hash = bcrypt.hashSync(plainPassword, 10);
    
    // Prepare and run the SQL Insert statement
    const stmt = db.prepare(`
      INSERT INTO users (full_name, email, password_hash) 
      VALUES (?, ?, ?)
    `);
    
    const info = stmt.run(fullName, email, hash);
    
    return { success: true, userId: info.lastInsertRowid };
  } catch (error) {
    // Handle the case where the email is already in the database
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return { success: false, error: 'An account with this email already exists.' };
    }
    return { success: false, error: 'Database error occurred.' };
  }
};

// ==========================================
// 2. LOGIN MODEL (Verify existing user)
// ==========================================
export const verifyUser = (email, plainPassword) => {
  try {
    // Find the user by their email
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    const user = stmt.get(email);

    // If no user is found with that email
    if (!user) {
      return { success: false, error: 'Invalid email or password.' };
    }

    // Compare the typed password with the hashed password in the DB
    const isValid = bcrypt.compareSync(plainPassword, user.password_hash);
    
    if (!isValid) {
      return { success: false, error: 'Invalid email or password.' };
    }

    // Passwords match! Remove the hash from the object before returning it
    // for security reasons so it doesn't accidentally get sent to the frontend
    const { password_hash, ...safeUser } = user;
    
    return { success: true, user: safeUser };
  } catch (error) {
    return { success: false, error: 'Database error occurred.' };
  }
};