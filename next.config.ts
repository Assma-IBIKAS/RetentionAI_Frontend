import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: "standalone",
    async rewrites() {
        const backendUrl = "http://localhost:8000";

        return [
            {
                source: "/api/:path",
                destination: `${backendUrl}/:path`,
            },
        ];
    },
};

export default nextConfig;