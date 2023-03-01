import { gql } from '@apollo/client'
import { Period } from '@js-joda/core'
import { addDays, eachDayOfInterval, endOfWeek, format, startOfWeek } from 'date-fns'
import { debounce } from 'lodash'
import React from 'react'
import { fullNameDayOfWeekFormatStr, singleLetterDayOfWeekFormatStr } from '../../../common/constants/timeFormatStrings'
import { LocalDateString, localDateStringToDateObject, toLocalDateString } from '../../../common/dates'
import {
  Enum_Action_Item_Input_Type_Enum,
  useClearActionItemRecordsMutation,
  useDeleteMetricRecordByMetricIdAndExternalIdMutation,
  useRecordActionItemMutation,
  useUpsertMetricRecordMutation,
  useWeeklyUserActionPlanQuery,
  WeeklyUserActionPlanQuery,
  ClearActionItemRecordsMutationOptions,
  DeleteMetricRecordByMetricIdAndExternalIdMutationOptions,
  Enum_Action_Item_Logger_Type_Enum,
  Enum_Metric_Rollup_Type_Enum,
  Enum_Rollup_Interval_Type_Enum,
  RecordActionItemMutationOptions,
  UpsertMetricRecordMutationOptions,
} from '../../../generated/graphql'
import { isValidDateObject } from '../../../typescript/guards/isValidDateObject'

import { getWeekDaysRangeLabelString } from '../../../utilities/dates/getWeekDaysRangeLabelString'
import { machineTextFormatter } from '../../../utilities/machineTextFormatter'
import { transformDateRange, transformRange } from '../../../utilities/rangeTransform'
import { makePersonalizedActionTitle, mutationDebounceTime } from '../common'
import { useToasts } from './useToasts'

gql`
  query WeeklyUserActionPlan($begin: date!, $end: date!) {
    action_item_user {
      id
      interval_type
      interval_count
      value_rollup_type
      preference_value_target
      instance_target
      sort_order
      action_item_user_inputs {
        action_item_user_supplements {
          supplement_records(where: { date: { _gte: $begin, _lte: $end } }) {
            id
            servings
            date
            timeframe
          }
          id
          servings
          supplement {
            serving_size
            name
            id
            brand
          }
        }
        action_item_input {
          id
          data_source
          metric_id
          input_type
        }
      }
      action_item {
        timeframe
        id
        name
        logger_type
        preference_unit {
          display_symbol
          display_name
          display_name_plural
        }
      }
      dailies(input: { begin: $begin, end: $end }) {
        date
        value: preferenceValue
        targetMet
        target
        records {
          metricRecordId
        }
      }
      action_item_user_periods(where: { period_start: { _gte: $begin }, period_end: { _lte: $end } }) {
        period
        instance_target
      }
    }
  }
`

// The id can be the actionItemId or the userActionItemId
// The 'completed' field is optional. If passed, it will mark the action as completed.
// If 'completed' is not passed, 'value' is required for the BE to handle the 'completed' field.
gql`
  mutation RecordActionItem($input: RecordActionInput!) {
    record_action(input: $input) {
      id
    }
  }
`

gql`
  mutation ClearActionItemRecords($input: ClearActionInput!) {
    clear_action(input: $input) {
      id
    }
  }
`

function getInstanceTargetFromRange(rangeString: string) {
  const { lower, upper, upperIsFinite } = transformRange(rangeString, true)
  /* defaulting to 7 fot the relevant target if one doesn't exist */
  return (upperIsFinite ? upper : lower) ?? 7
}

// TODO see if we need to do something to handle targets that are of the "no more than X" form
function getWeeklyProgress(actionItemUser: ActionItemUser) {
  let relevantTarget: number | undefined = undefined
  const periods = actionItemUser.action_item_user_periods

  // If a week has a single period, use that target, otherwise multiply the daily target by 7
  for (const { period, instance_target } of periods) {
    const periodRange = transformDateRange(period, true)
    const { lower, upper } = periodRange
    const periodDuration = lower && upper ? Period.between(lower, upper).days() : undefined

    if (periodDuration === 7) {
      // return target as is
      relevantTarget = getInstanceTargetFromRange(instance_target)
      break
    } else if (periodDuration === 1) {
      relevantTarget = 7 * getInstanceTargetFromRange(instance_target)
      break
    }
  }

  // If there is no period (due to no data), use the target from the actionItemUser
  if (!relevantTarget) {
    const { lower, upper, upperIsFinite } = transformRange(actionItemUser.instance_target, true)
    /* defaulting to 7 fot the relevant target if one doesn't exist */
    relevantTarget = (upperIsFinite ? upper : lower) ?? 7
  }

  // if the target is met, and the interval is daily, we know the target met count per week is 7
  const weeklyTargetMetGoal =
    actionItemUser.interval_type === Enum_Rollup_Interval_Type_Enum.week ? relevantTarget ?? 7 : 7
  const weeklyTargetMetCount = actionItemUser.dailies.reduce((acc, daily) => acc + Number(daily.targetMet), 0)
  return { weeklyTargetMetGoal, weeklyTargetMetCount }
}

const makeWeek = (date: Date) => {
  const start = startOfWeek(date)
  const end = endOfWeek(date)
  const weekDateIntervalArray = eachDayOfInterval({ start, end })
  return weekDateIntervalArray.reduce(
    (acc, x) => ({
      ...acc,
      [format(x, fullNameDayOfWeekFormatStr).toLowerCase()]: toLocalDateString(x),
    }),
    {} as {
      [key in 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday']: LocalDateString
    }
  )
}
type ActionItemUser = WeeklyUserActionPlanQuery['action_item_user'][number]

const processDailies = (actionItemUser: ActionItemUser) => {
  const processed = actionItemUser.dailies.map((daily) => {
    const localDateString = daily.date
    const date = localDateStringToDateObject(localDateString)
    return {
      ...daily,
      localDateString,
      actionItemId: actionItemUser.action_item.id,
      logged: daily.records.length > 0,
      date,
      label: format(date, singleLetterDayOfWeekFormatStr),
      targetValue: daily.target !== '(,)' ? Number(daily.target.match(/\[(\d+),\)/)?.[1]) : null,
      supplements:
        actionItemUser.action_item_user_inputs
          .find((actionItemUserInput) => actionItemUserInput.action_item_user_supplements.length)
          ?.action_item_user_supplements.map((actionItemUserSupplement) => {
            const matchingRecords = actionItemUserSupplement.supplement_records.filter(
              (supplementRecord) =>
                supplementRecord.timeframe === actionItemUser.action_item.timeframe &&
                supplementRecord.date === localDateString
            )

            return {
              actionItemUserSupplementId: actionItemUserSupplement.id,
              id: actionItemUserSupplement.supplement.id,
              name: actionItemUserSupplement.supplement.name,
              targetServings: actionItemUserSupplement.servings,
              servingSize: actionItemUserSupplement.supplement.serving_size ?? '',
              brand: actionItemUserSupplement.supplement.brand,
              timeframe: actionItemUser.action_item.timeframe,
              value: matchingRecords?.length ? matchingRecords.reduce((acc, x) => acc + x.servings ?? 0, 0) : null,
            }
          }) ?? [],
    }
  })

  return processed
}

export function makeMutationKey(actionId: string, date: string | Date) {
  const dateInput = isValidDateObject(date) ? toLocalDateString(date) : date

  return `${actionId}-${dateInput}`
}

export type MutationOptions = {
  mutationKey: string
  clearActionitemRecordsOptions?: ClearActionItemRecordsMutationOptions
  recordActionItemOptions?: RecordActionItemMutationOptions
  recordRmMetricRecordOptions?: UpsertMetricRecordMutationOptions
  deleteMetricRecordByMetricIdAndExternalIdOptions?: DeleteMetricRecordByMetricIdAndExternalIdMutationOptions
}

export type UseWeeklyUserActionPlanReturn = ReturnType<typeof useWeeklyUserActionPlan>
export type ActionLogActionItem = UseWeeklyUserActionPlanReturn['weeklyUserActionPlan'][number]

export const useWeeklyUserActionPlan = (date?: Date) => {
  const week = makeWeek(date ?? new Date())

  const end = toLocalDateString(addDays(new Date(week.saturday), 2))

  const {
    data,
    loading: queryLoading,
    error: queryError,
    refetch: refetchActionPlan,
  } = useWeeklyUserActionPlanQuery({
    variables: { begin: week.sunday, end },
  })

  const [recordActionItem, recordActionitemResult] = useRecordActionItemMutation()

  const [clearActionItemRecords, clearActionItemRecordsResult] = useClearActionItemRecordsMutation()

  const [inFlightMutations, setInFlightMutations] = React.useState<Record<string, boolean>>({})

  const weeklyUserActionPlan = React.useMemo(() => {
    if (!data) return []

    const actionItemUserItemsLength = data.action_item_user.length

    return data.action_item_user
      .map((actionItemUser) => {
        const processedDailies = processDailies(actionItemUser)

        const selectedInputs = actionItemUser.action_item_user_inputs.map((input) => input.action_item_input)
        const metricId =
          selectedInputs.find(
            (actionItemInput) => actionItemInput.input_type === Enum_Action_Item_Input_Type_Enum.metric
          )?.metric_id ?? ''

        const loggerType = actionItemUser.action_item.logger_type
        const isSupplement = loggerType === Enum_Action_Item_Logger_Type_Enum.SUPPLEMENT
        const isNutrition = !!(loggerType === Enum_Action_Item_Logger_Type_Enum.NUTRITION && metricId)
        const isHydration = !!(loggerType === Enum_Action_Item_Logger_Type_Enum.HYDRATION && metricId)
        const isWellness = !!(loggerType === Enum_Action_Item_Logger_Type_Enum.WELLNESS && metricId)

        const unit = actionItemUser.action_item.preference_unit?.[0]
        return {
          id: actionItemUser.action_item.id,
          name: actionItemUser.action_item.name,
          dateRangeString: getWeekDaysRangeLabelString({ startDate: processedDailies[0].date }),
          sortOrder: actionItemUser.sort_order ?? actionItemUserItemsLength,
          unit,
          title: makePersonalizedActionTitle(
            {
              intervalType: actionItemUser.interval_type,
              instanceTarget: actionItemUser.instance_target,
              valueTarget: actionItemUser.preference_value_target ?? '',
              name: actionItemUser.action_item.name,
              nameShowPlaceholders: false,
              unit,
              isRollup: actionItemUser.value_rollup_type !== Enum_Metric_Rollup_Type_Enum.none,
            },
            true
          ),
          source: machineTextFormatter(selectedInputs[0]?.data_source ?? '').upperCase,
          inputType:
            isNutrition || isHydration
              ? Enum_Action_Item_Input_Type_Enum.increment
              : isWellness
              ? Enum_Action_Item_Input_Type_Enum.scale
              : isSupplement
              ? Enum_Action_Item_Input_Type_Enum.supplement
              : selectedInputs.filter(
                  (actionItemInput) => actionItemInput.input_type !== Enum_Action_Item_Input_Type_Enum.metric
                )[0]?.input_type,
          isSupplement,
          isNutrition,
          isHydration,
          isWellness,
          dailies: processedDailies,
          metricId,
          ...getWeeklyProgress(actionItemUser),
        }
      })

      .sort((a, b) => a.sortOrder - b.sortOrder)
  }, [data])

  const [recordRmMetricRecord] = useUpsertMetricRecordMutation()
  const [deleteMetricRecordByMetricIdAndExternalId] = useDeleteMetricRecordByMetricIdAndExternalIdMutation()

  const loading = queryLoading || recordActionitemResult.loading || clearActionItemRecordsResult.loading
  const error = queryError || recordActionitemResult.error || clearActionItemRecordsResult.error

  const { setSuccessToast, setErrorToast } = useToasts()

  const { current: debouncedMutationsByDay } = React.useRef(
    Array.from({ length: 7 }, () => {
      return debounce((options: MutationOptions) => {
        const {
          clearActionitemRecordsOptions,
          recordActionItemOptions,
          deleteMetricRecordByMetricIdAndExternalIdOptions,
          recordRmMetricRecordOptions,
          mutationKey,
        } = options

        setInFlightMutations((s) => ({ ...s, [mutationKey]: true }))
        const mutation = clearActionitemRecordsOptions
          ? clearActionItemRecords(clearActionitemRecordsOptions)
          : deleteMetricRecordByMetricIdAndExternalIdOptions
          ? deleteMetricRecordByMetricIdAndExternalId(deleteMetricRecordByMetricIdAndExternalIdOptions)
          : recordActionItemOptions
          ? recordActionItem(recordActionItemOptions)
          : recordRmMetricRecordOptions
          ? recordRmMetricRecord(recordRmMetricRecordOptions)
          : Promise.reject()

        mutation
          .then(() => setSuccessToast('Action logged.'))
          .catch(() => setErrorToast('Error logging action.'))
          .finally(() => {
            refetchActionPlan()
            setInFlightMutations((s) => ({ ...s, [mutationKey]: false }))
          })
      }, mutationDebounceTime)
    })
  )

  return {
    weeklyUserActionPlan,
    loading,
    error,
    inFlightMutations,
    setInFlightMutations,
    refetchActionPlan,
    debouncedMutationsByDay,
  }
}
