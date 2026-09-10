import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  // Payload + sqlite needs Node runtime, not edge
  experimental: {
    // keep turpopack as is
  },
};

export default withPayload(nextConfig);
