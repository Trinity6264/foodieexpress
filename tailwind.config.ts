// Note: In Tailwind CSS v4, the 'content' configuration is no longer needed
// as it scans your project automatically. The file can be very minimal.
import type { Config } from "tailwindcss";

const config: Config = {
    content: ["./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {},
    },
    plugins: [],
};

export default config;