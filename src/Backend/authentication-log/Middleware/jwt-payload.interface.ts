export interface JwtPayload {
    userId: string;        // The unique ID of the user (could be from your User schema)
    email: string;         // Optional: The email of the user
    role: string;          // Optional: The role of the user (e.g., 'admin', 'instructor', 'student')
    // You can include other fields you need, such as `username`, `firstName`, etc.
  }
  