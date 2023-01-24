import Icon from '@components/Icon'
import CustomText from '@components/Text'
import { StyleConstants } from '@utils/styles/constants'
import { useTheme } from '@utils/styles/ThemeManager'
import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { PlaceholderLine } from 'rn-placeholder'
import AccountContext from '../Context'

const AccountInformationCreated: React.FC = () => {
  const { account, pageMe } = useContext(AccountContext)

  if (pageMe) {
    return null
  }

  const { i18n } = useTranslation()
  const { colors } = useTheme()
  const { t } = useTranslation('screenTabs')

  if (account) {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          borderRadius: 0,
          marginBottom: StyleConstants.Spacing.M
        }}
      >
        <Icon
          name='calendar'
          size={StyleConstants.Font.Size.S}
          color={colors.secondary}
          style={{ marginRight: StyleConstants.Spacing.XS }}
        />
        <CustomText fontStyle='S' style={{ color: colors.secondary }}>
          {t('shared.account.created_at', {
            date: new Date(account.created_at || '').toLocaleDateString(i18n.language, {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })
          })}
        </CustomText>
      </View>
    )
  } else {
    return (
      <PlaceholderLine
        width={StyleConstants.Font.Size.S * 4}
        height={StyleConstants.Font.LineHeight.S}
        color={colors.shimmerDefault}
        noMargin
        style={{ borderRadius: 0, marginBottom: StyleConstants.Spacing.M }}
      />
    )
  }
}

export default AccountInformationCreated
