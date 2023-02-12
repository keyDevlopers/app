import { HeaderRight } from '@components/Header'
import Timeline from '@components/Timeline'
import SegmentedControl from '@react-native-segmented-control/segmented-control'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { TabPublicStackParamList } from '@utils/navigation/navigators'
import { QueryKeyTimeline } from '@utils/queryHooks/timeline'
import { getGlobalStorage, setGlobalStorage } from '@utils/storage/actions'
import { StorageGlobal } from '@utils/storage/global'
import { useTheme } from '@utils/styles/ThemeManager'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Dimensions } from 'react-native'
import { SceneMap, TabView } from 'react-native-tab-view'

const Route = ({ route: { key: page } }: { route: any }) => {
  const queryKey: QueryKeyTimeline = ['Timeline', { page }]
  return <Timeline queryKey={queryKey} disableRefresh={page === 'Trending'} />
}

const renderScene = SceneMap({
  Local: Route,
  LocalPublic: Route,
  Trending: Route
})

const Root: React.FC<NativeStackScreenProps<TabPublicStackParamList, 'Tab-Public-Root'>> = ({
  navigation
}) => {
  const { mode } = useTheme()
  const { t } = useTranslation('screenTabs')

  const segments: StorageGlobal['app.prev_public_segment'][] = ['Local', 'LocalPublic', 'Trending']
  const [segment, setSegment] = useState<number>(
    Math.max(
      0,
      segments.findIndex(segment => segment === getGlobalStorage.string('app.prev_public_segment'))
    )
  )
  const [routes] = useState([
    { key: 'Local', title: t('tabs.public.segments.local') },
    { key: 'LocalPublic', title: t('tabs.public.segments.federated') },
    { key: 'Trending', title: t('tabs.public.segments.trending') }
  ])
  useEffect(() => {
    const page = segments[segment]
    page && navigation.setParams({ queryKey: ['Timeline', { page }] })
  }, [segment])

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        // @ts-ignore
        <SegmentedControl
          appearance={mode}
          values={routes.map(({ title }) => title)}
          selectedIndex={segment}
          onChange={({ nativeEvent }: any) => {
            setSegment(nativeEvent.selectedSegmentIndex)
            setGlobalStorage('app.prev_public_segment', segments[nativeEvent.selectedSegmentIndex])
          }}
          style={{ flexBasis: '65%' }}
        />
      ),
      headerRight: () => (
        <HeaderRight
          accessibilityLabel={t('common.search.accessibilityLabel')}
          accessibilityHint={t('common.search.accessibilityHint')}
          content='search'
          onPress={() => navigation.navigate('Tab-Shared-Search')}
        />
      )
    })
  }, [mode, segment])

  return (
    <TabView
      lazy
      swipeEnabled
      renderScene={renderScene}
      renderTabBar={() => null}
      onIndexChange={index => {
        setSegment(index)
        setGlobalStorage('app.prev_public_segment', segments[index])
      }}
      navigationState={{ index: segment, routes }}
      initialLayout={{ width: Dimensions.get('window').width }}
    />
  )
}

export default Root
