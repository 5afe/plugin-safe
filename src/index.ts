import { Plugin } from "@elizaos/core";
import { walletProvider } from "./providers";

export const safePlugin: Plugin = {
    name: "safe",
    description: "Safe Plugin for Eliza",
    actions: [],
    evaluators: [],
    providers: [walletProvider]
  };
  
  export default safePlugin;