import menuInstance from '@components/contextMenu/instance'
import menuShare from '@components/contextMenu/share'
import menuStatus from '@components/contextMenu/status'
import TimelineActioned from '@components/Timeline/Shared/Actioned'
import TimelineActions from '@components/Timeline/Shared/Actions'
import TimelineAttachment from '@components/Timeline/Shared/Attachment'
import TimelineAvatar from '@components/Timeline/Shared/Avatar'
import TimelineCard from '@components/Timeline/Shared/Card'
import TimelineContent from '@components/Timeline/Shared/Content'
import TimelineHeaderNotification from '@components/Timeline/Shared/HeaderNotification'
import TimelinePoll from '@components/Timeline/Shared/Poll'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { featureCheck } from '@utils/helpers/featureCheck'
import { checkIsMyAccount } from '@utils/helpers/isMyAccount'
import { TabLocalStackParamList } from '@utils/navigation/navigators'
import { usePreferencesQuery } from '@utils/queryHooks/preferences'
import { QueryKeyTimeline } from '@utils/queryHooks/timeline'
import { StyleConstants } from '@utils/styles/constants'
import { useTheme } from '@utils/styles/ThemeManager'
import React, { Fragment, useState } from 'react'
import { Pressable, View } from 'react-native'
import * as ContextMenu from 'zeego/context-menu'
import StatusContext from './Shared/Context'
import TimelineFiltered, { FilteredProps, shouldFilter } from './Shared/Filtered'
import TimelineFullConversation from './Shared/FullConversation'
import TimelineHeaderAndroid from './Shared/HeaderAndroid'

export interface Props {
  notification: Mastodon.Notification
  queryKey: QueryKeyTimeline
}

const TimelineNotifications: React.FC<Props> = ({ notification, queryKey }) => {
  const { data: preferences } = usePreferencesQuery()

  const status = notification.status?.reblog ? notification.status.reblog : notification.status
  const account =
    notification.type === 'admin.report'
      ? notification.report.target_account
      : notification.status
      ? notification.status.account
      : notification.account
  const isMyAccount = checkIsMyAccount(notification.account?.id)
  const [spoilerExpanded, setSpoilerExpanded] = useState(
    preferences?.['reading:expand:spoilers'] || false
  )
  const spoilerHidden = notification.status?.spoiler_text?.length
    ? !preferences?.['reading:expand:spoilers'] && !spoilerExpanded
    : false

  const { colors } = useTheme()
  const navigation = useNavigation<StackNavigationProp<TabLocalStackParamList>>()

  const main = () => {
    return (
      <>
        {notification.type !== 'mention' ? (
          <TimelineActioned
            action={notification.type}
            isNotification
            account={notification.account}
            rootStatus={notification.status}
          />
        ) : null}

        <View
          style={{
            opacity:
              notification.type === 'follow' ||
              notification.type === 'follow_request' ||
              notification.type === 'mention' ||
              notification.type === 'status' ||
              notification.type === 'admin.sign_up'
                ? 1
                : 0.5
          }}
        >
          <View style={{ flex: 1, width: '100%', flexDirection: 'row' }}>
            <TimelineAvatar account={account} />
            <TimelineHeaderNotification notification={notification} />
          </View>

          {notification.status ? (
            <View style={{ paddingLeft: StyleConstants.Avatar.M + StyleConstants.Spacing.S }}>
              <TimelineContent
                notificationOwnToot={['favourite', 'reblog'].includes(notification.type)}
                setSpoilerExpanded={setSpoilerExpanded}
              />
              <TimelinePoll />
              <TimelineAttachment />
              <TimelineCard />
              <TimelineFullConversation />

              <TimelineActions />
            </View>
          ) : null}
        </View>
      </>
    )
  }

  const mShare = menuShare({
    visibility: notification.status?.visibility,
    type: 'status',
    url: notification.status?.url || notification.status?.uri
  })
  const mStatus = menuStatus({ status: notification.status, queryKey })
  const mInstance = menuInstance({ status: notification.status, queryKey })

  if (!isMyAccount) {
    let filterResults: FilteredProps['filterResults'] = []
    const [filterRevealed, setFilterRevealed] = useState(false)
    const hasFilterServerSide = featureCheck('filter_server_side')
    if (notification.status) {
      if (hasFilterServerSide) {
        if (notification.status.filtered?.length) {
          filterResults = notification.status.filtered.map(filter => filter.filter)
        }
      } else {
        const checkFilter = shouldFilter({ queryKey, status: notification.status })
        if (checkFilter?.length) {
          filterResults = checkFilter
        }
      }

      if (filterResults?.length && !filterRevealed) {
        return !filterResults.filter(result => result.filter_action === 'hide')?.length ? (
          <Pressable onPress={() => setFilterRevealed(!filterRevealed)}>
            <TimelineFiltered filterResults={filterResults} />
          </Pressable>
        ) : null
      }
    }
  }

  return (
    <StatusContext.Provider
      value={{
        queryKey,
        status,
        isMyAccount,
        spoilerHidden
      }}
    >
      <ContextMenu.Root>
        <ContextMenu.Trigger>
          <Pressable
            style={{
              padding: StyleConstants.Spacing.Global.PagePadding,
              backgroundColor: colors.backgroundDefault,
              paddingBottom: notification.status ? 0 : StyleConstants.Spacing.Global.PagePadding
            }}
            onPress={() =>
              notification.status &&
              navigation.push('Tab-Shared-Toot', { toot: notification.status })
            }
            onLongPress={() => {}}
            children={main()}
          />
        </ContextMenu.Trigger>

        <ContextMenu.Content>
          {[mShare, mStatus, mInstance].map((menu, i) => (
            <Fragment key={i}>
              {menu.map((group, index) => (
                <ContextMenu.Group key={index}>
                  {group.map(item => {
                    switch (item.type) {
                      case 'item':
                        return (
                          <ContextMenu.Item key={item.key} {...item.props}>
                            <ContextMenu.ItemTitle children={item.title} />
                            {item.icon ? <ContextMenu.ItemIcon ios={{ name: item.icon }} /> : null}
                          </ContextMenu.Item>
                        )
                      case 'sub':
                        return (
                          // @ts-ignore
                          <ContextMenu.Sub key={item.key}>
                            <ContextMenu.SubTrigger key={item.trigger.key} {...item.trigger.props}>
                              <ContextMenu.ItemTitle children={item.trigger.title} />
                              {item.trigger.icon ? (
                                <ContextMenu.ItemIcon ios={{ name: item.trigger.icon }} />
                              ) : null}
                            </ContextMenu.SubTrigger>
                            <ContextMenu.SubContent>
                              {item.items.map(sub => (
                                <ContextMenu.Item key={sub.key} {...sub.props}>
                                  <ContextMenu.ItemTitle children={sub.title} />
                                  {sub.icon ? (
                                    <ContextMenu.ItemIcon ios={{ name: sub.icon }} />
                                  ) : null}
                                </ContextMenu.Item>
                              ))}
                            </ContextMenu.SubContent>
                          </ContextMenu.Sub>
                        )
                    }
                  })}
                </ContextMenu.Group>
              ))}
            </Fragment>
          ))}
        </ContextMenu.Content>
      </ContextMenu.Root>
      <TimelineHeaderAndroid />
    </StatusContext.Provider>
  )
}

export default React.memo(TimelineNotifications, () => true)
