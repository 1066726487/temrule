/**
 * @file Jest测试框架配置文件
 * @author 老船长
 * @date 2022.04.25
 */

// 以下是运行Midway框架官方命令`midway-bin test --ts`时，底层生成的命令行执行代码，仅供参考
// ./node_modules/jest/bin/jest.js ['/test/.*\\.test\\.ts$', '--_=test', '--V', '--config=/Users/shallker/code/qiduoduo-inc/front-circle-node-server/node_modules/@midwayjs/cli-plugin-test/config/jest.ts.js']

process.env.MIDWAY_TS_MODE = 'true';
process.env.MIDWAY_JEST_MODE = 'true';

module.exports = {
  preset: 'ts-jest',

  verbose: true,

  // 测试运行环境
  testEnvironment: 'node',

  // 指定Jest使用jest-circus的运行器，解决beforeAll在报错的情况下，还会继续往下运行的问题
  // 详见：https://github.com/facebook/jest/issues/2713
  testRunner: 'jest-circus/runner',

  rootDir: __dirname,

  // 以.ts .tsx结尾的文件，统一使用ts-jest转换成js
  transform: {
    '^.+\\.ts$': require.resolve('ts-jest'),
  },


  moduleDirectories: [
    'node_modules',
  ],



  // 检测是否有内存泄露
  detectLeaks: true,

  // 记录内存的使用情况
  logHeapUsage: true,

  globals: {
    '__GLOBAL_FOO__': true,
    '__GLOBAL_NUM__': 1,
  },

  // 在单测文件里，可以直接使用describe、test、expect等Jest提供的方法
  // 如果关闭此选项，则需要手动import这些方法，来使用
  injectGlobals: true,

  // A number limiting the number of tests that are allowed to run at the same time when using test.concurrent.
  // Any test above this limit will be queued and executed once a slot is released.
  maxConcurrency: 1,

  // Specifies the maximum number of workers the worker-pool will spawn for running tests.
  // In single run mode, this defaults to the number of the cores available on your machine minus one for the main thread.
  // In watch mode, this defaults to half of the available cores on your machine to ensure Jest is unobtrusive and does not grind your machine to a halt.
  // It may be useful to adjust this in resource limited environments like CIs but the defaults should be adequate for most use-cases.
  maxWorkers: '100%',

  // 有时候，由于一些代码（定时器，监听等）在后台运行，导致单测跑完后会无法退出进程，对于这个情况，要设置强制退出
  forceExit: true,

  // The number of seconds after which a test is considered as slow and reported as such in the results.
  // 超过5秒钟的单测，被标记为过慢的测试
  slowTestThreshold: 5,

  // 默认的异步测试等待时间30秒
  // 包括beforeAll、beforeEach、afterAll、afterEach等
  // 超过了等待时间，Jest就会跳过，自动开始运行后面的测试代码
  // 建议在调试 Debug 时，可以将默认等待时间设置到60秒以上，留出足够多的调试时间，避免自动跳出
  // 单位：毫秒
  testTimeout: 1000 * 30
};
