import path from 'path';
import webpack from 'webpack';
import CopyPlugin from 'copy-webpack-plugin';

class BuildEnvironment {
  public readonly production: boolean;
  public get mode(): webpack.Configuration['mode'] {
    return this.production ? 'production' : 'development';
  }
  public get sourceMapNeeds(): boolean {
    return !this.production;
  }
  constructor({ production }: Record<string, boolean | number | string>) {
    this.production = production ? true : false;
  }
}

export default <webpack.ConfigurationFactory>((rawEnv) => {
  if (rawEnv !== undefined && typeof rawEnv !== 'object') {
    throw new TypeError(`ENV expected object, actual: ${typeof rawEnv}`);
  }
  const env = new BuildEnvironment(rawEnv || {});
  return <webpack.Configuration>{
    entry: {
      app: './src/main.ts',
      vendors: ['phaser'],
    },

    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },

    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
    },

    output: {
      filename: 'app.bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },

    mode: env.mode,

    devServer: {
      contentBase: path.resolve(__dirname, 'dist'),
      writeToDisk: true,
      open: true,
    },

    plugins: [
      new CopyPlugin({
        patterns: [
          {
            from: 'index.html',
          },
          {
            from: 'assets/**/*',
          },
        ],
      }),
      new webpack.DefinePlugin({
        'typeof CANVAS_RENDERER': JSON.stringify(true),
        'typeof WEBGL_RENDERER': JSON.stringify(true),
      }),
    ],

    optimization: {
      splitChunks: {
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            filename: '[name].app.bundle.js',
          },
        },
      },
    },
  };
});
