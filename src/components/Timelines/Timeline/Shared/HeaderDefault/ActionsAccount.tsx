import React from 'react'
import { useMutation, useQueryClient } from 'react-query'
import client from '@api/client'
import { MenuContainer, MenuHeader, MenuRow } from '@components/Menu'
import { toast } from '@components/toast'

const fireMutation = async ({
  type,
  id,
  stateKey
}: {
  type: 'mute' | 'block' | 'reports'
  id: string
  stateKey?: 'muting' | 'blocking'
}) => {
  let res
  switch (type) {
    case 'mute':
    case 'block':
      res = await client({
        method: 'post',
        instance: 'local',
        url: `accounts/${id}/${type}`
      })

      if (res.body[stateKey!] === true) {
        toast({ type: 'success', content: '功能成功' })
        return Promise.resolve()
      } else {
        toast({ type: 'error', content: '功能错误', autoHide: false })
        return Promise.reject()
      }
      break
    case 'reports':
      res = await client({
        method: 'post',
        instance: 'local',
        url: `reports`,
        params: {
          account_id: id!
        }
      })
      if (!res.body.error) {
        toast({ type: 'success', content: '举报账户成功' })
        return Promise.resolve()
      } else {
        toast({
          type: 'error',
          content: '举报账户失败，请重试',
          autoHide: false
        })
        return Promise.reject()
      }
      break
  }
}

export interface Props {
  queryKey: QueryKey.Timeline
  accountId: string
  account: string
  setBottomSheetVisible: React.Dispatch<React.SetStateAction<boolean>>
}

const HeaderDefaultActionsAccount: React.FC<Props> = ({
  queryKey,
  accountId,
  account,
  setBottomSheetVisible
}) => {
  const queryClient = useQueryClient()
  const { mutate } = useMutation(fireMutation, {
    onMutate: () => {
      queryClient.cancelQueries(queryKey)
      const oldData = queryClient.getQueryData(queryKey)
      return oldData
    },
    onError: (err, _, oldData) => {
      toast({ type: 'error', content: '请重试', autoHide: false })
      queryClient.setQueryData(queryKey, oldData)
    }
  })

  return (
    <MenuContainer>
      <MenuHeader heading='关于账户' />
      <MenuRow
        onPress={() => {
          setBottomSheetVisible(false)
          mutate({
            type: 'mute',
            id: accountId,
            stateKey: 'muting'
          })
        }}
        iconFront='eye-off'
        title={`隐藏 @${account} 的嘟嘟`}
      />
      <MenuRow
        onPress={() => {
          setBottomSheetVisible(false)
          mutate({
            type: 'block',
            id: accountId,
            stateKey: 'blocking'
          })
        }}
        iconFront='x-circle'
        title={`屏蔽用户 @${account}`}
      />
      <MenuRow
        onPress={() => {
          setBottomSheetVisible(false)
          mutate({
            type: 'reports',
            id: accountId
          })
        }}
        iconFront='flag'
        title={`举报 @${account}`}
      />
    </MenuContainer>
  )
}

export default HeaderDefaultActionsAccount
