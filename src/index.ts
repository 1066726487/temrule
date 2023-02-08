import { readFileSync } from 'fs'
import {MDswitch} from './mustache'
import { join } from 'path'

const testStr = readFileSync(join(__dirname, '../README.MD'),'utf-8')

const m = new MDswitch(testStr)

m.render()

