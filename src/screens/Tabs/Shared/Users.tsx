import ComponentAccount from '@components/Account'
import ComponentSeparator from '@components/Separator'
import { TabSharedStackScreenProps } from '@utils/navigation/navigators'
import { QueryKeyUsers, useUsersQuery } from '@utils/queryHooks/users'
import React, { useCallback } from 'react'
import { StyleSheet } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'

const TabSharedUsers = React.memo(
  ({ route: { params } }: TabSharedStackScreenProps<'Tab-Shared-Users'>) => {
    const queryKey: QueryKeyUsers = ['Users', params]
    const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
      useUsersQuery({
        ...queryKey[1],
        options: {
          getPreviousPageParam: firstPage =>
            firstPage.links?.prev && { since_id: firstPage.links.next },
          getNextPageParam: lastPage =>
            lastPage.links?.next && { max_id: lastPage.links.next }
        }
      })
    const flattenData = data?.pages
      ? data.pages.flatMap(page => [...page.body])
      : []

    const onEndReached = useCallback(
      () => hasNextPage && !isFetchingNextPage && fetchNextPage(),
      [hasNextPage, isFetchingNextPage]
    )

    return (
      <FlatList
        windowSize={7}
        data={flattenData}
        style={styles.flatList}
        renderItem={({ item }) => (
          <ComponentAccount account={item} origin='relationship' />
        )}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.75}
        ItemSeparatorComponent={ComponentSeparator}
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
          autoscrollToTopThreshold: 2
        }}
      />
    )
  },
  () => true
)

const styles = StyleSheet.create({
  flatList: {
    minHeight: '100%'
  }
})

export default TabSharedUsers
