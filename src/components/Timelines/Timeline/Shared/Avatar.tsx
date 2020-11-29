import React, { useCallback } from 'react'
import { Image, Pressable, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import constants from 'src/utils/styles/constants'

export interface Props {
  uri: string
  id: string
}

const Avatar: React.FC<Props> = ({ uri, id }) => {
  const navigation = useNavigation()
  // Need to fix go back root
  const onPress = useCallback(() => {
    navigation.navigate('Screen-Shared-Account', {
      id: id
    })
  }, [])

  return (
    <Pressable style={styles.avatar} onPress={onPress}>
      <Image source={{ uri: uri }} style={styles.image} />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  avatar: {
    width: constants.AVATAR_S,
    height: constants.AVATAR_S,
    marginRight: constants.SPACING_S
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 6
  }
})

export default React.memo(Avatar, () => true)
