import {Analysis} from './analysis'
import { defaultRule } from './rule/default'

const analysis = new Analysis
analysis.use(defaultRule)



// 规则基类
export * from './base/rule-base'

// 搜索器
export * from './lib/scanner'

// token
export * from './lib/token'

