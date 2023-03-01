import { Range, transformRange } from '../../utilities/rangeTransform'
import { Enum_Rollup_Interval_Type_Enum, Unit, ActionItemLibraryQuery } from '../../generated/graphql'
import { pluralize } from '../../utilities/pluralize'

export const fullscreenCarouselButtonControlsHeight = 64
export const mutationDebounceTime = 300

export const categoryQueryParamName = 'category'

export const actionItemListContainerId = 'actionItemListContainer'
export const weeklyReportStartDateQueryParamName = 'weeklyReportStartDate'

type ActionItemQueryItem = ActionItemLibraryQuery['action_item'][number]
type ActionItemQueryItemUnit = Exclude<ActionItemQueryItem['preference_unit'], undefined>[number]

function formatTemplate(template: string, data: Record<string, string | number | undefined>) {
  return Object.entries(data).reduce(
    (acc, [key, value]) => acc.replaceAll(`\${${key}}`, value?.toString() ?? ''),
    template
  )
}

function formatActionName(
  template: string,
  nameShowPlaceholders: boolean,
  valueTarget: Range,
  unit?: ActionItemQueryItemUnit
) {
  let target: string | number
  if (nameShowPlaceholders) {
    target = `X`
  } else if (valueTarget.isFullyUnbounded) {
    // so we don't have infinity
    target = 0
  } else {
    target = valueTarget.lowerIsFinite ? valueTarget.lower : valueTarget.upper
    if (target > 1) {
      target = Math.round(target)
    }
  }

  let unitString: string | undefined
  if (target === 1) {
    unitString = unit?.display_name
  } else {
    unitString = unit?.display_name_plural ?? unit?.display_name
  }

  return formatTemplate(template, {
    target,
    unit: unitString,
  })
}

// TODO at some point we may need to tightent these types up instead of basing them off of ActionLibraryActionItem since
// the types at the call site are getting slightly divergent and this seems slightly long and messy
type MakePersonalizedActionTitleInput = {
  name: string
  valueTarget: string
  instanceTarget: string
  intervalType: string
  unit?: Pick<Unit, 'display_symbol' | 'display_name' | 'display_name_plural'>
  isRollup: boolean
  nameShowPlaceholders: boolean
}

function formatInterval(actionData: MakePersonalizedActionTitleInput) {
  const instanceRangeData = transformRange(actionData.instanceTarget, true)

  const lowestIncludedValue = instanceRangeData.lowerInc ? instanceRangeData.lower : instanceRangeData.lower + 1
  const highestIncludedValue = instanceRangeData.upperInc ? instanceRangeData.upper : instanceRangeData.upper - 1

  if (actionData.isRollup) {
    return `every ${actionData.intervalType}`
  }

  const timeUnit = actionData.intervalType === Enum_Rollup_Interval_Type_Enum.week ? 'day' : 'time'
  // we have a MAX
  if (instanceRangeData.upperIsFinite) {
    const upperValue = highestIncludedValue + 1
    return `less than ${upperValue} ${pluralize(timeUnit, upperValue)} per ${actionData.intervalType}`
  }

  // minimum value
  if (instanceRangeData.lowerIsFinite) {
    if (lowestIncludedValue === 1) {
      return `every ${actionData.intervalType}`
    }

    return `${lowestIncludedValue} ${pluralize(timeUnit, lowestIncludedValue)} per ${actionData.intervalType}`
  }

  return ''
}

export const makePersonalizedActionTitle = (actionData: MakePersonalizedActionTitleInput, inPlan = false): string => {
  const usePlaceholders = !inPlan && actionData.nameShowPlaceholders
  const base = formatActionName(
    actionData.name,
    usePlaceholders,
    transformRange(actionData.valueTarget, true),
    actionData.unit
  )

  if (!inPlan) {
    return base
  }

  const interval = formatInterval(actionData)
  return `${base}, ${interval}`
}
