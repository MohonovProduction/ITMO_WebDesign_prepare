/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Основной «рабочий» оттенок — перивинкль из пастельной палитры,
        // углублённый снизу для читаемых кнопок и текста.
        brand: {
          50: '#f1f5fb',
          100: '#e2e9f7',
          200: '#cbd7f1',
          300: '#b5d4e9',
          400: '#a4afe8',
          500: '#788ac7',
          600: '#596da8',
          700: '#425781',
          800: '#35485a',
          900: '#243746',
        },
        // Пастельная палитра с изображения (для фона, акцентов, уровней)
        pastel: {
          yellow: '#fbf8cc',
          peach: '#fde4cf',
          rose: '#ffcfd2',
          pink: '#f1c0e8',
          lavender: '#cfbaf0',
          periwinkle: '#a3c4f3',
          sky: '#90dbf4',
          cyan: '#8eecf5',
          aqua: '#98f5e1',
          mint: '#b9fbc0',
        },
        // Чуть насыщеннее — чтобы прогресс-бары и заливки были различимы
        accent: {
          mint: '#7fd1a6',
          sky: '#6cb6e8',
          pink: '#e29ad4',
          lavender: '#b89be8',
          peach: '#f0b48a',
          yellow: '#ecd96a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
