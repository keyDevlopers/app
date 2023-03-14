import GracefullyImage from '@components/GracefullyImage'
import openLink from '@components/openLink'
import CustomText from '@components/Text'
import { useNeodbQuery } from '@utils/queryHooks/neodb'
import { StyleConstants } from '@utils/styles/constants'
import { useTheme } from '@utils/styles/ThemeManager'
import * as Linking from 'expo-linking'
import { Pressable, View } from 'react-native'
import { Rating } from './Rating'

export type Props = {
  card: Mastodon.Card
}

export const CardNeodb: React.FC<Props> = ({ card }) => {
  const { colors } = useTheme()

  const segments = Linking.parse(card.url).path?.split('/')
  if (!segments || !(segments[0] === 'movie' || segments[0] === 'book' || segments[0] === 'tv'))
    return null

  const { data } = useNeodbQuery({ path: `${segments[0]}/${segments[1]}` })

  if (!data) return null

  const pressableDefaults = {
    style: {
      marginTop: StyleConstants.Spacing.S,
      backgroundColor: colors.shimmerDefault,
      borderRadius: StyleConstants.BorderRadius,
      padding: StyleConstants.Spacing.S,
      flexDirection: 'row' as 'row'
    },
    onPress: () => openLink(card.url)
  }

  const itemImage = data.cover_image_url ? (
    <GracefullyImage
      sources={{ default: { uri: data.cover_image_url } }}
      dimension={{
        width: StyleConstants.Font.LineHeight.M * 4,
        height: StyleConstants.Font.LineHeight.M * 5
      }}
      style={{ marginRight: StyleConstants.Spacing.S }}
      imageStyle={{ borderRadius: StyleConstants.BorderRadius / 2 }}
      dim
    />
  ) : null
  const itemHeading = (value: string) => (
    <CustomText
      fontStyle='S'
      fontWeight='Bold'
      style={{ color: colors.primaryDefault }}
      numberOfLines={3}
      children={value}
    />
  )
  const itemDetails = (value: string) => (
    <CustomText
      fontStyle='S'
      style={{ color: colors.secondary }}
      numberOfLines={1}
      children={value}
    />
  )

  switch (segments[0]) {
    case 'movie':
      return (
        <Pressable {...pressableDefaults}>
          {itemImage}
          <View style={{ flex: 1, gap: StyleConstants.Spacing.S }}>
            {itemHeading(
              [data.title, data.orig_title, data.year ? `(${data.year})` : null]
                .filter(d => d)
                .join(' ')
            )}
            <Rating rating={data.rating / 2} />
            {itemDetails(
              [
                data.duration ? `${data.duration}分钟` : null,
                data.area?.join(' '),
                data.genre?.join(' '),
                data.director?.join(' ')
              ]
                .filter(d => d)
                .join(' / ')
            )}
          </View>
        </Pressable>
      )
    case 'book':
      return (
        <Pressable {...pressableDefaults}>
          {itemImage}
          <View style={{ flex: 1, gap: StyleConstants.Spacing.S }}>
            {itemHeading(
              [
                data.title,
                data.pub_year && data.pub_month ? `(${data.pub_year}年${data.pub_month}月)` : null
              ]
                .filter(d => d)
                .join(' ')
            )}
            <Rating rating={data.rating / 2} />
            {itemDetails(
              [
                data.author?.join(' '),
                data.language,
                data.pages ? `${data.pages}页` : null,
                data.pub_house
              ]
                .filter(d => d)
                .join(' / ')
            )}
          </View>
        </Pressable>
      )
    case 'tv':
      return (
        <Pressable {...pressableDefaults}>
          {itemImage}
          <View style={{ flex: 1, gap: StyleConstants.Spacing.S }}>
            {itemHeading(
              [data.title, data.orig_title, data.year ? `(${data.year})` : null]
                .filter(d => d)
                .join(' ')
            )}
            <Rating rating={data.rating / 2} />
            {itemDetails(
              [
                data.season_count ? `共${data.season_count}季` : null,
                data.area?.join(' '),
                data.genre?.join(' '),
                data.director?.join(' ')
              ]
                .filter(d => d)
                .join(' / ')
            )}
          </View>
        </Pressable>
      )
    default:
      return null
  }
}
