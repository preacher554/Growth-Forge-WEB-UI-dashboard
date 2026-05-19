module.exports = {
  apps: [
    {
      name: "growthforge-mission-monitor",
      script: "npm",
      args: "start",
      cwd: __dirname,
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
