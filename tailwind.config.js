'use strict'

/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    './renderer/src/**/*.{html,js,jsx,tsx}'
  ],
  theme: {
    fontSize: {
      'header-3xs': ['20px', '24px'],
      'header-2xs': ['24px', '28px'],
      'header-xs': ['28px', '36px'],
      'header-s': ['36px', '44px'],
      'header-m': ['44px', '52px'],
      'header-l': ['52px', '68px'],
      'body-3xs': ['10px', '14px'],
      'body-2xs': ['12px', '16px'],
      'body-xs': ['14px', '20px'],
      'body-s': ['16px', '20px'],
      'body-m': ['20px', '28px'],
      'body-l': ['36px', '52px'],
      'mono-3xs': ['12px', '16px'],
      'mono-2xs': ['14px', '20px'],
      'mono-xs': ['16px', '20px'],
      'mono-s': ['20px', '28px'],
      'mono-m': ['24px', '36px'],
      'mono-l': ['28px', '36px'],
      'mono-xl': ['36px', '52px'],
      'mono-2xl': ['44px', '52px']
    },
    fontFamily: {
      title: ['SuisseIntl', 'sans-serif'],
      body: ['SpaceGrotesk', 'serif'],
      mono: ['SpaceMono', 'monospace']
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      bold: 700
    },
    colors: {
      white: '#fff',
      black: '#000',
      primary: '#2a1cf7',
      'primary-hover': '#1A1199',
      'primary-click': '#2317CC',
      grayscale: {
        100: '#f0f0f0',
        200: '#f7f7f7',
        250: '#e9ebf1',
        300: '#ebeaea',
        400: '#c3cad9',
        500: '#b3b3b3',
        600: '#666666',
        700: '#313131'
      },
      slate: {
        50: '#F1F1F5',
        100: '#EAEAEF',
        200: '#D9D9E4',
        400: '#A0A1BA',
        600: '#7B7799',
        800: '#5F5A73'
      },
      green: {
        100: '#33cc9d',
        200: '#68cc58'
      },
      red: {
        100: '#ce5347',
        200: '#ff4d81'
      },
      orange: {
        100: '#f5c451',
        200: '#f76003'
      },
      transparent: '#ffffff00'
    }
  },
  plugins: []
}
