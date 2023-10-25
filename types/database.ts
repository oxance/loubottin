import { MergeDeep } from 'type-fest'
import { Database as DatabaseGenerated } from './database.generated'
import { TagName } from 'src/app/api.service'
export { Json } from './database.generated'

export type Database = MergeDeep<
  DatabaseGenerated,
  {
    public: {
      Tables: {
        contacts: {
          Row: {
            tags: TagName[]
          }
        }
      }
    }
  }
>