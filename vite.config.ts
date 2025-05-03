import { defineConfig } from 'vite';
import postcssJitProps from 'postcss-jit-props';
import OpenProps from 'open-props';

export default defineConfig(() => ({
  css: {
    postcss: {
      plugins: [
        postcssJitProps(OpenProps)
      ]
    }
  }
}));


