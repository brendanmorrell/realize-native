import { createHttpLink } from '@apollo/client'

export const gqlLink = createHttpLink({ uri: process.env.GQL_API_ENDPOINT })
