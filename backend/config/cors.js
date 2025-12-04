export const corsOptions = (frontendOrigin) => ({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    const allowedOrigins = frontendOrigin.split(",").map((o) => o.trim());

    if (frontendOrigin === "*" || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
});
