export default {
  heading: 'Settings',
  content: {
    push: {
      heading: '$t(meSettingsPush:heading)',
      content: {
        enabled: 'Enabled',
        disabled: 'Disabled'
      }
    },
    fontsize: {
      heading: '$t(meSettingsFontsize:heading)',
      content: {
        S: '$t(meSettingsFontsize:content.sizes.S)',
        M: '$t(meSettingsFontsize:content.sizes.M)',
        L: '$t(meSettingsFontsize:content.sizes.L)',
        XL: '$t(meSettingsFontsize:content.sizes.XL)',
        XXL: '$t(meSettingsFontsize:content.sizes.XXL)'
      }
    },
    language: {
      heading: 'Language',
      options: {
        en: 'English',
        'zh-Hans': '简体中文',
        cancel: '$t(common:buttons.cancel)'
      }
    },
    theme: {
      heading: 'Appearance',
      options: {
        auto: 'As system',
        light: 'Light mode',
        dark: 'Dark mode',
        cancel: '$t(common:buttons.cancel)'
      }
    },
    browser: {
      heading: 'Opening link',
      options: {
        internal: 'Inside app',
        external: 'Use system browser',
        cancel: '$t(common:buttons.cancel)'
      }
    },
    cache: {
      heading: 'Clear cache',
      empty: 'Cache empty'
    },
    support: {
      heading: 'Support tooot'
    },
    review: {
      heading: 'Review tooot'
    },
    contact: {
      heading: 'Contact tooot'
    },
    analytics: {
      heading: 'Help us improve',
      description: 'Collecting only non-user relative usage'
    },
    version: 'Version v{{version}}'
  }
}
