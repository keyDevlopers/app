import menuInstance from '@components/contextMenu/instance'
import menuShare from '@components/contextMenu/share'
import menuStatus from '@components/contextMenu/status'
import TimelineActioned from '@components/Timeline/Shared/Actioned'
import TimelineActions from '@components/Timeline/Shared/Actions'
import TimelineAttachment from '@components/Timeline/Shared/Attachment'
import TimelineAvatar from '@components/Timeline/Shared/Avatar'
import TimelineCard from '@components/Timeline/Shared/Card'
import TimelineContent from '@components/Timeline/Shared/Content'
import TimelineHeaderDefault from '@components/Timeline/Shared/HeaderDefault'
import TimelinePoll from '@components/Timeline/Shared/Poll'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { TabLocalStackParamList } from '@utils/navigation/navigators'
import { QueryKeyTimeline } from '@utils/queryHooks/timeline'
import { getInstanceAccount } from '@utils/slices/instancesSlice'
import { StyleConstants } from '@utils/styles/constants'
import { useTheme } from '@utils/styles/ThemeManager'
import { uniqBy } from 'lodash'
import React, { useRef } from 'react'
import { Pressable, StyleProp, View, ViewStyle } from 'react-native'
import { useSelector } from 'react-redux'
import * as ContextMenu from 'zeego/context-menu'
import TimelineFeedback from './Shared/Feedback'
import TimelineFiltered, { shouldFilter } from './Shared/Filtered'
import TimelineFullConversation from './Shared/FullConversation'
import TimelineHeaderAndroid from './Shared/HeaderAndroid'
import TimelineTranslate from './Shared/Translate'

export interface Props {
  item: Mastodon.Status & { _pinned?: boolean } // For account page, internal property
  queryKey?: QueryKeyTimeline
  rootQueryKey?: QueryKeyTimeline
  highlighted?: boolean
  disableDetails?: boolean
  disableOnPress?: boolean
}

// When the poll is long
const TimelineDefault: React.FC<Props> = ({
  item,
  queryKey,
  rootQueryKey,
  highlighted = false,
  disableDetails = false,
  disableOnPress = false
}) => {
  const { colors } = useTheme()
  const instanceAccount = useSelector(getInstanceAccount, () => true)
  const navigation = useNavigation<StackNavigationProp<TabLocalStackParamList>>()

  const actualStatus = item.reblog ? item.reblog : item

  const ownAccount = actualStatus.account?.id === instanceAccount?.id

  const copiableContent = useRef<{ content: string; complete: boolean }>({
    content: '',
    complete: false
  })

  const filtered = queryKey && shouldFilter({ copiableContent, status: actualStatus, queryKey })
  if (queryKey && filtered && !highlighted) {
    return <TimelineFiltered phrase={filtered} />
  }

  const onPress = () => {
    if (highlighted) return
    navigation.push('Tab-Shared-Toot', {
      toot: actualStatus,
      rootQueryKey: queryKey
    })
  }

  const mainStyle: StyleProp<ViewStyle> = {
    padding: StyleConstants.Spacing.Global.PagePadding,
    backgroundColor: colors.backgroundDefault,
    paddingBottom: disableDetails ? StyleConstants.Spacing.Global.PagePadding : 0
  }
  const main = () => (
    <>
      {item.reblog ? (
        <TimelineActioned action='reblog' account={item.account} />
      ) : item._pinned ? (
        <TimelineActioned action='pinned' account={item.account} />
      ) : null}

      <View style={{ flex: 1, width: '100%', flexDirection: 'row' }}>
        <TimelineAvatar
          queryKey={disableOnPress ? undefined : queryKey}
          account={actualStatus.account}
          highlighted={highlighted}
        />
        <TimelineHeaderDefault
          queryKey={disableOnPress ? undefined : queryKey}
          rootQueryKey={rootQueryKey}
          status={actualStatus}
          highlighted={highlighted}
          copiableContent={copiableContent}
        />
      </View>

      <View
        style={{
          paddingTop: highlighted ? StyleConstants.Spacing.S : 0,
          paddingLeft: highlighted ? 0 : StyleConstants.Avatar.M + StyleConstants.Spacing.S
        }}
      >
        {typeof actualStatus.content === 'string' && actualStatus.content.length > 0 ? (
          <TimelineContent
            status={actualStatus}
            highlighted={highlighted}
            disableDetails={disableDetails}
          />
        ) : null}
        {queryKey && actualStatus.poll ? (
          <TimelinePoll
            queryKey={queryKey}
            rootQueryKey={rootQueryKey}
            statusId={actualStatus.id}
            poll={actualStatus.poll}
            reblog={item.reblog ? true : false}
            sameAccount={ownAccount}
          />
        ) : null}
        {!disableDetails &&
        Array.isArray(actualStatus.media_attachments) &&
        actualStatus.media_attachments.length ? (
          <TimelineAttachment status={actualStatus} />
        ) : null}
        {!disableDetails && actualStatus.card ? <TimelineCard card={actualStatus.card} /> : null}
        {!disableDetails ? (
          <TimelineFullConversation queryKey={queryKey} status={actualStatus} />
        ) : null}
        <TimelineTranslate status={actualStatus} highlighted={highlighted} />
        <TimelineFeedback status={actualStatus} highlighted={highlighted} />
      </View>

      {queryKey && !disableDetails ? (
        <TimelineActions
          queryKey={queryKey}
          rootQueryKey={rootQueryKey}
          highlighted={highlighted}
          status={actualStatus}
          ownAccount={ownAccount}
          accts={uniqBy(
            ([actualStatus.account] as Mastodon.Account[] & Mastodon.Mention[])
              .concat(actualStatus.mentions)
              .filter(d => d?.id !== instanceAccount?.id),
            d => d?.id
          ).map(d => d?.acct)}
          reblog={item.reblog ? true : false}
        />
      ) : null}
    </>
  )

  const mShare = menuShare({
    visibility: actualStatus.visibility,
    type: 'status',
    url: actualStatus.url || actualStatus.uri,
    copiableContent
  })
  const mStatus = menuStatus({ status: actualStatus, queryKey, rootQueryKey })
  const mInstance = menuInstance({ status: actualStatus, queryKey, rootQueryKey })

  return disableOnPress ? (
    <View style={mainStyle}>{main()}</View>
  ) : (
    <>
      <ContextMenu.Root>
        <ContextMenu.Trigger>
          <Pressable
            accessible={highlighted ? false : true}
            style={mainStyle}
            onPress={onPress}
            onLongPress={() => {}}
            children={main()}
          />
        </ContextMenu.Trigger>

        <ContextMenu.Content>
          {mShare.map((mGroup, index) => (
            <ContextMenu.Group key={index}>
              {mGroup.map(menu => (
                <ContextMenu.Item key={menu.key} {...menu.item}>
                  <ContextMenu.ItemTitle children={menu.title} />
                  <ContextMenu.ItemIcon iosIconName={menu.icon} />
                </ContextMenu.Item>
              ))}
            </ContextMenu.Group>
          ))}

          {mStatus.map((mGroup, index) => (
            <ContextMenu.Group key={index}>
              {mGroup.map(menu => (
                <ContextMenu.Item key={menu.key} {...menu.item}>
                  <ContextMenu.ItemTitle children={menu.title} />
                  <ContextMenu.ItemIcon iosIconName={menu.icon} />
                </ContextMenu.Item>
              ))}
            </ContextMenu.Group>
          ))}

          {mInstance.map((mGroup, index) => (
            <ContextMenu.Group key={index}>
              {mGroup.map(menu => (
                <ContextMenu.Item key={menu.key} {...menu.item}>
                  <ContextMenu.ItemTitle children={menu.title} />
                  <ContextMenu.ItemIcon iosIconName={menu.icon} />
                </ContextMenu.Item>
              ))}
            </ContextMenu.Group>
          ))}
        </ContextMenu.Content>
      </ContextMenu.Root>
      <TimelineHeaderAndroid
        queryKey={disableOnPress ? undefined : queryKey}
        rootQueryKey={rootQueryKey}
        status={actualStatus}
      />
    </>
  )
}

export default TimelineDefault
