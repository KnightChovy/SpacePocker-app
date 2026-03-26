import swaggerJSDoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "SpacePocker API",
      version: "1.0.0",
      description: "API documentation",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local server",
      },
    ],
    tags: [
      { name: "Auth", description: "Authentication APIs" },
      {
        name: "Booking Request",
        description: "Booking Request APIs - Manage room booking requests",
      },
      {
        name: "Payment",
        description:
          "Payment APIs — VNPAY online payment and offline payment confirmation (cash / bank transfer)",
      },
      { name: "User", description: "User management APIs" },
      { name: "Room", description: "Room management APIs" },
      { name: "Building", description: "Building management APIs" },
      { name: "Amenity", description: "Amenity management APIs" },
      { name: "Service", description: "Service management APIs" },
      {
        name: "ServiceCategory",
        description: "Service Category management APIs",
      },
      { name: "Booking", description: "Booking APIs" },
      { name: "Check-in", description: "Room check-in / check-out APIs" },
      { name: "Feedback", description: "Feedback APIs" },
      { name: "Admin", description: "Admin management APIs" },
      {
        name: "Transactions",
        description: "Transaction history and financial reporting APIs",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },

  apis: ["src/routes/**/*.ts", "src/**/*.ts"],
});
