import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { MenuContainer, MenuItem } from 'src/components/Menu'

const Settings: React.FC = () => {
  const { t } = useTranslation('meRoot')
  const navigation = useNavigation()

  return (
    <MenuContainer>
      <MenuItem
        iconFront='settings'
        title={t('content.settings')}
        onPress={() => navigation.navigate('Screen-Me-Settings')}
      />
    </MenuContainer>
  )
}

export default Settings
