import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { TabPublicStackParamList } from '@utils/navigation/navigators'
import React from 'react'
import TabShared from '../Shared'
import Root from './Root'

const Stack = createNativeStackNavigator<TabPublicStackParamList>()

const TabPublic: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShadowVisible: false }}>
      <Stack.Screen name='Tab-Public-Root' component={Root} />
      {TabShared({ Stack })}
    </Stack.Navigator>
  )
}

export default TabPublic
