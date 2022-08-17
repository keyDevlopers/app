import Timeline from '@components/Timeline'
import TimelineDefault from '@components/Timeline/Default'
import { QueryKeyTimeline } from '@utils/queryHooks/timeline'
import React from 'react'

const TabMeFavourites = React.memo(
  () => {
    const queryKey: QueryKeyTimeline = ['Timeline', { page: 'Favourites' }]

    return (
      <Timeline
        queryKey={queryKey}
        customProps={{
          renderItem: ({ item }) => (
            <TimelineDefault item={item} queryKey={queryKey} />
          )
        }}
      />
    )
  },
  () => true
)

export default TabMeFavourites
