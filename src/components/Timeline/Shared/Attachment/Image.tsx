import GracefullyImage from '@components/GracefullyImage'
import { StyleConstants } from '@utils/styles/constants'
import React from 'react'
import { View } from 'react-native'
import AttachmentAltText from './AltText'
import attachmentAspectRatio from './aspectRatio'

export interface Props {
  total: number
  index: number
  sensitiveShown: boolean
  image: Mastodon.AttachmentImage
  navigateToImagesViewer: (imageIndex: string) => void
}

const AttachmentImage = ({
  total,
  index,
  sensitiveShown,
  image,
  navigateToImagesViewer
}: Props) => {
  return (
    <View
      style={{
        flex: 1,
        flexBasis: '50%',
        padding: StyleConstants.Spacing.XS / 2
      }}
    >
      <GracefullyImage
        accessibilityLabel={image.description}
        hidden={sensitiveShown}
        uri={{ original: image.preview_url, remote: image.remote_url }}
        blurhash={image.blurhash}
        onPress={() => navigateToImagesViewer(image.id)}
        style={{
          aspectRatio:
            total > 1 || !image.meta?.original?.width || !image.meta?.original?.height
              ? attachmentAspectRatio({ total, index })
              : image.meta.original.height / image.meta.original.width > 1
              ? 1
              : image.meta.original.width / image.meta.original.height
        }}
      />
      <AttachmentAltText sensitiveShown={sensitiveShown} text={image.description} />
    </View>
  )
}

export default AttachmentImage
