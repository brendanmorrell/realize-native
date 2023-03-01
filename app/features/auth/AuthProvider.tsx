import React from 'react'
import { Auth0Provider } from 'react-native-auth0'
import config from '../../auth0-configuration'
import { Auth0ExternalUsageModuleSetter } from '../apollo/Auth0ExternalModuleSetter'

type Props = React.PropsWithChildren<{}>

export function AuthProvider({ children }: Props) {
  return (
    <Auth0Provider domain={config.domain} clientId={config.clientId}>
      <>
        <Auth0ExternalUsageModuleSetter />
        {children}
      </>
    </Auth0Provider>
  )
}
