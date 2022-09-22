import { ComponentEmojis } from '@components/Emojis'
import { EmojisState } from '@components/Emojis/helpers/EmojisContext'
import { HeaderLeft, HeaderRight } from '@components/Header'
import ComponentInput from '@components/Input'
import { TabMeProfileStackScreenProps } from '@utils/navigation/navigators'
import { useProfileMutation } from '@utils/queryHooks/profile'
import { StyleConstants } from '@utils/styles/constants'
import { useTheme } from '@utils/styles/ThemeManager'
import React, { RefObject, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert, ScrollView, TextInput } from 'react-native'
import FlashMessage from 'react-native-flash-message'

const TabMeProfileNote: React.FC<
  TabMeProfileStackScreenProps<'Tab-Me-Profile-Note'> & {
    messageRef: RefObject<FlashMessage>
  }
> = ({
  messageRef,
  route: {
    params: { note }
  },
  navigation
}) => {
  const { theme } = useTheme()
  const { t, i18n } = useTranslation('screenTabs')
  const { mutateAsync, status } = useProfileMutation()

  const [notes, setNotes] = useState(note)
  const notesProps: NonNullable<EmojisState['inputProps'][0]> = {
    value: [notes, setNotes],
    selection: useState({ start: notes.length }),
    isFocused: useRef<boolean>(false),
    ref: useRef<TextInput>(null),
    maxLength: 500
  }

  const [dirty, setDirty] = useState(false)
  useEffect(() => {
    setDirty(note !== notes)
  }, [notes])

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <HeaderLeft
          onPress={() => {
            if (dirty) {
              Alert.alert(
                t('me.profile.cancellation.title'),
                t('me.profile.cancellation.message'),
                [
                  {
                    text: t('me.profile.cancellation.buttons.cancel'),
                    style: 'default'
                  },
                  {
                    text: t('me.profile.cancellation.buttons.discard'),
                    style: 'destructive',
                    onPress: () => navigation.navigate('Tab-Me-Profile-Root')
                  }
                ]
              )
            } else {
              navigation.navigate('Tab-Me-Profile-Root')
            }
          }}
        />
      ),
      headerRight: () => (
        <HeaderRight
          disabled={!dirty}
          loading={status === 'loading'}
          content='Save'
          onPress={async () => {
            mutateAsync({
              theme,
              messageRef,
              message: {
                text: 'me.profile.root.note.title',
                succeed: true,
                failed: true
              },
              type: 'note',
              data: notes
            }).then(() => {
              navigation.navigate('Tab-Me-Profile-Root')
            })
          }}
        />
      )
    })
  }, [theme, i18n.language, dirty, status, notes])

  return (
    <ComponentEmojis inputProps={[notesProps]}>
      <ScrollView style={{ paddingHorizontal: StyleConstants.Spacing.Global.PagePadding }}>
        <ComponentInput {...notesProps} multiline />
      </ScrollView>
    </ComponentEmojis>
  )
}

export default TabMeProfileNote
