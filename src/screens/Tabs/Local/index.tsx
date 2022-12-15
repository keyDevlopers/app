import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { TabLocalStackParamList } from '@utils/navigation/navigators'
import React from 'react'
import TabShared from '../Shared'
import Root from './Root'

const Stack = createNativeStackNavigator<TabLocalStackParamList>()

const TabLocal: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShadowVisible: false }}>
      <Stack.Screen name='Tab-Local-Root' component={Root} />
      {TabShared({ Stack })}
    </Stack.Navigator>
  )
}

export default TabLocal
