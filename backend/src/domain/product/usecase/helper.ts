// helper to check if product is still valid based on the created_at and time_window

export const isProductTimeWindowInvalid = (createdAt: Date, timeWindow: number): boolean => {
    // Calculate the expiration time based on the created_at and time_window
    const expirationTime = new Date();
    expirationTime.setHours(createdAt.getHours() + timeWindow);
  
    // Get the current time
    const currentTime = new Date();
  
    // Check if the current time is before the expiration time in milliseconds (UTC)
    if (currentTime.getTime() < expirationTime.getTime()) {
      console.log('already invalid');
      return true;
    }
    
    return false;
}
