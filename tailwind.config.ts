import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  mode: 'jit',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  plugins: [],
}
export default config
