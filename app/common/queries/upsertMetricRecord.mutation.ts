import { gql } from '@apollo/client'

gql`
  mutation UpsertMetricRecord($object: MetricRecordCreateInputType!, $dataSource: data_source!) {
    upsert_metric_record_one(object: $object, data_source: $dataSource) {
      id
      value
      external_id
      datetime_utc
    }
  }
`

gql`
  mutation UpsertMetricRecordBatch($objects: [MetricRecordCreateInputType!]!, $dataSource: data_source!) {
    upsert_metric_records(objects: $objects, data_source: $dataSource) {
      id
      value
      external_id
      datetime_utc
    }
  }
`
