import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * En `next dev`, Next 16 bloquea las peticiones cross-origin a los recursos
   * de desarrollo. Si abres la app desde un host que no reconoce, el HTML
   * llega bien renderizado pero el cliente nunca hidrata: la página se ve
   * perfecta y no responde a nada.
   *
   * Esto cubre 127.0.0.1. Medido en Next 16.3.1: para una IP de red local
   * (192.168.x.x) NO basta — el WebSocket de HMR sigue devolviendo 403 en
   * cualquiera de sus formas ("192.168.1.132", con puerto o con protocolo), y
   * en desarrollo la hidratación depende de que ese socket conecte. Para
   * probar desde otro dispositivo de la red, usa una build de producción
   * (`npm run build && npm start`), que no tiene HMR y funciona por IP.
   *
   * Se ignora por completo en producción.
   */
  allowedDevOrigins: ["localhost", "127.0.0.1"],

  images: {
    remotePatterns: [
      // Fotografía del hero de la home.
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      // Placeholders del dataset de experiencias (CONTEXT.md §5.2).
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
