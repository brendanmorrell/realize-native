import React from 'react'
import { useAuth0 } from 'react-native-auth0'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { LogInPage } from './pages/LogInPage'
import { ActionPlanPage } from '../action-plan/pages/ActionPlanPage'
import { Loading } from '../../common/page-components/Loading'
import { EditActionPlanPage } from '../action-plan/pages/EditActionPlanPage'

const Stack = createNativeStackNavigator<RootStackParamList>()

export type RootStackParamList = {
  loading: undefined
  actionPlan: undefined
  editActionPlan: undefined
  logIn: undefined
}

export function Navigation() {
  const { isLoading, user } = useAuth0()

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator>
          {isLoading ? (
            <Stack.Screen name="loading" component={Loading} options={{ title: 'loading' }} />
          ) : user ? (
            <>
              <Stack.Screen name="actionPlan" component={ActionPlanPage} options={{ title: 'Action Plan' }} />
              <Stack.Screen name="editActionPlan" component={EditActionPlanPage} options={{ title: 'Action Plan' }} />
            </>
          ) : (
            <Stack.Screen name="logIn" component={LogInPage} options={{ title: 'Log in' }} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </>
  )
}
