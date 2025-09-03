module.exports = {
  mediaCodecs: [
    {
      kind: "audio",
      mimeType: "audio/opus",
      clockRate: 48000,
      channels: 2,
    },
    {
      kind: "video",
      mimeType: "video/VP8",
      clockRate: 90000,
    },
  ],

  transportOptions: {
    listenIps: [
      {
        ip: "127.0.0.1",       // Replace with public IP in production
        announcedIp: null,
      },
    ],
    enableUdp: true,
    enableTcp: true,
    preferUdp: true,
  }
};