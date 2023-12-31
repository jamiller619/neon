import { Schema } from 'conf'
import { type ConfigSchema, json } from '@neon/shared/config'
import { name } from '../../../../package.json'
import { ConfigStore } from './store'

const config = new ConfigStore({
  projectName: name,
  projectSuffix: '',
  schema: json.properties as Schema<ConfigSchema>,
})

export default config
