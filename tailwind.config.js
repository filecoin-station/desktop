'use strict'

/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    './renderer/src/**/*.{html,js,jsx,tsx}'
  ],
  theme: {
    fontSize: {
      base: '1.25rem',
      'header-3xs': '1.25rem',
      'header-2xs': '1.5rem',
      'header-xs': '1.75rem',
      'header-s': '2.25rem',
      'header-m': '2.75rem',
      'header-l': '3.25rem',
      'body-3xs': '0.625rem',
      'body-2xs': '0.75rem',
      'body-xs': '0.875rem',
      'body-s': '1rem',
      'body-m': '1.25rem',
      'body-l': '1.75rem'
    },
    fontFamily: {
      title: ['SuisseIntl', 'sans-serif'],
      body: ['SpaceGrotesk', 'serif'],
      number: ['SpaceMono', 'monospace']
    },
    colors: {
      white: '#fff',
      black: '#000',
      primary: '#2a1cf7',
      'primary-hover': '#1A1199',
      'primary-click': '#2317CC',
      accent: '#40ffc4',
      secondary: '#30b7e8',
      'secondary-accent': '#d5f710',
      'tertiary-accent': '#330867',
      grayscale: {
        200: '#f7f7f7',
        300: '#f1f4f5',
        400: '#f0f0f0',
        500: '#ededed',
        600: '#cccccc',
        700: '#b3b3b3'
      },
      success: '#33cc9d',
      error: '#ff4d81',
      warning: '#f76003',
      'transparent-gray': '#f7f7f7e3',
      transparent: '#ffffff00'
    }
  },
  plugins: []
}
