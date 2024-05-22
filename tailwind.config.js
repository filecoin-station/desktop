'use strict'

/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    './renderer/src/**/*.{html,js,jsx,tsx}'
  ],
  theme: {
    fontSize: {
      'header-3xs': ['1.25rem', '1.5rem'],
      'header-2xs': ['1.5rem', '1.75rem'],
      'header-xs': ['1.75rem', '2.25rem'],
      'header-s': ['2.25rem', '2.75rem'],
      'header-m': ['2.75rem', '3.25rem'],
      'header-l': ['3.25rem', '4.25rem'],
      'body-3xs': ['0.625rem', '0.875rem'],
      'body-2xs': ['0.75rem', '1rem'],
      'body-xs': ['0.875rem', '1.25rem'],
      'body-s': ['1rem', '1.25rem'],
      'body-m': ['1.25rem', '1.75rem'],
      'body-l': ['2.25rem', '3.25rem'],
      'mono-3xs': ['0.75rem', '1rem'],
      'mono-2xs': ['0.875rem', '1.25rem'],
      'mono-xs': ['1rem', '1.25rem'],
      'mono-s': ['1.25rem', '1.75rem'],
      'mono-m': ['1.5rem', '2.25rem'],
      'mono-l': ['1.75rem', '2.25rem'],
      'mono-xl': ['2.25rem', '3.25rem'],
      'mono-2xl': ['2.75rem', '3.25rem']
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
    boxShadow: {
      switchButton: '0px 1px 3px 0px #1018281A, 0px 1px 2px -1px #1018281A'
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
  plugins: [],
  safelist: [
    {
      pattern: /text-(header|body|mono)-(3xs|2xs|xs|s|m|l|xl|2xl)/
    },
    {
      pattern: /text-(black|secondary|primary|white)/
    },
    {
      pattern: /font-(title|body|mono)/
    }
  ]
}
