# React + TypeScript + Vite

このテンプレートには、Vite 上で React を動かすための最小限の設定と、基本的な ESLint ルールが含まれています。HMR（ホットモジュールリプレースメント）にも対応しています。

現在、公式プラグインを2種類利用できます。

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) は [Oxc](https://oxc.rs) を使用します。
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) は [SWC](https://swc.rs/) を使用します。

## React Compiler（React コンパイラー）

開発時およびビルド時のパフォーマンスへの影響を考慮し、このテンプレートでは React Compiler を有効にしていません。有効化する方法は[公式ドキュメント](https://react.dev/learn/react-compiler/installation)を参照してください。

## ESLint の設定を拡張する

本番アプリケーションを開発する場合は、型情報を利用する lint ルールを有効にするよう設定を更新することをおすすめします。

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // その他の設定...

      // tseslint.configs.recommended を削除し、こちらに置き換えてください
      tseslint.configs.recommendedTypeChecked,
      // より厳格なルールを適用する場合はこちらを使用します
      tseslint.configs.strictTypeChecked,
      // 必要に応じて、スタイルに関するルールも追加できます
      tseslint.configs.stylisticTypeChecked,

      // その他の設定...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // その他のオプション...
    },
  },
])

```

React 専用の lint ルールを利用するには、[eslint-plugin-react-x](https://npmx.dev/package/eslint-plugin-react-x) と [eslint-plugin-react-dom](https://npmx.dev/package/eslint-plugin-react-dom) をインストールする方法もあります。

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // その他の設定...
      // React の lint ルールを有効化
      reactX.configs['recommended-typescript'],
      // React DOM の lint ルールを有効化
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // その他のオプション...
    },
  },
])

```
