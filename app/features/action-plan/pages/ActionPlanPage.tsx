import { gql } from '@apollo/client'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { Button, Text, View } from 'react-native'
import { RootStackParamList } from '../../auth/Navigation'
import { useWeeklyUserActionPlan } from '../hooks/useWeeklyUserActionPlan'

type Props = NativeStackScreenProps<RootStackParamList, 'actionPlan'>
export function ActionPlanPage({ navigation }: Props) {
  const { weeklyUserActionPlan, loading } = useWeeklyUserActionPlan()
  console.log(`🚀 ~ loading:`, loading)
  return (
    <View>
      <Button onPress={() => navigation.navigate('editActionPlan')} title={'Edit'} />
      <Text>{JSON.stringify({ weeklyUserActionPlan })}</Text>
    </View>
  )
}
