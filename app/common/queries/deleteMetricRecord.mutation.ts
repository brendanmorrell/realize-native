import { gql } from '@apollo/client'

gql`
  mutation DeleteMetricRecordBatchByMetricIdsAndExternalId($metricIds: [uuid!]!, $externalId: String!) {
    delete_metric_record(where: { metric_id: { _in: $metricIds }, external_id: { _eq: $externalId } }) {
      affected_rows
      returning {
        external_id
        id
      }
    }
  }
`

gql`
  mutation DeleteMetricRecordByMetricIdAndExternalId($metricId: uuid!, $externalId: String!) {
    delete_metric_record(where: { metric_id: { _eq: $metricId }, external_id: { _eq: $externalId } }) {
      affected_rows
      returning {
        external_id
        id
        value: preference_value
      }
    }
  }
`
