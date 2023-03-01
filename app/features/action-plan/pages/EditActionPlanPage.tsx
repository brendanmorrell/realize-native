import { gql } from '@apollo/client'
import { Text, View } from 'react-native'

gql`
  fragment ActionItemInputFields on action_item_input {
    input_type
    id
    data_source
  }

  query ActionItemLibrary {
    action_item {
      value_target: preference_value_target
      instance_target
      labels {
        label {
          name
        }
      }
      id
      name
      name_show_placeholders
      logger_type
      interval_type
      interval_count
      value_rollup_type
      preference_unit {
        display_symbol
        display_name
        display_name_plural
      }
      action_item_inputs {
        ...ActionItemInputFields
      }
      action_item_users(order_by: { created_at: asc }, limit: 1) {
        id
        interval_type
        interval_count
        value_rollup_type
        value_target: preference_value_target
        instance_target
        sort_order
        action_item_user_inputs {
          action_item_user_supplements {
            id
            servings
            supplement {
              name
              id
            }
          }
          action_item_input {
            ...ActionItemInputFields
          }
        }
      }
    }
  }
`

gql`
  mutation DeselectActionItem($actionItemId: uuid!) {
    deselect_action_item(input: { actionItemId: $actionItemId })
  }
`

gql`
  mutation UpdateActionItemsSortOrder($updates: [action_item_user_updates!]!) {
    update_action_item_user_many(updates: $updates) {
      affected_rows
    }
  }
`

export function EditActionPlanPage() {
  return (
    <View>
      <Text>this is a thing</Text>
    </View>
  )
}
