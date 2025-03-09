
import { v4 as uuidv4 } from 'uuid';

// Function to get or create a unique session ID for the current browser
export const getSessionId = (): string => {
  const storageKey = 'engagewise_session_id';
  let sessionId = localStorage.getItem(storageKey);
  
  if (!sessionId) {
    // Generate a new UUID
    sessionId = uuidv4();
    localStorage.setItem(storageKey, sessionId);
  }
  
  return sessionId;
};
