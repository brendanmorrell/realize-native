const generateBaseOptions = {
  plugins: [
    'typescript',
    'typescript-operations',
    'typescript-react-apollo',
    {
      add: {
        placement: 'prepend',
        content: ['import type * as DateTypes from "../common/dates/index"'],
      },
    },
  ],
  config: {
    // set nullable fields as optional
    avoidOptionals: false,
    // Since they are optional, set the Maybe type to just be the value instead of 'T | null'
    maybeValue: 'T',
    // For inputs/args be flexible - allow both null or undefined value
    inputMaybeValue: 'T | null | undefined',
    skipTypename: false,
    withHooks: true,
    withHOC: false,
    withComponent: false,
    // This allows us to wrap the hook with custom logic
    // apolloReactHooksImportFrom: '../apollo/hooks/customApolloHooks',
    namingConvention: {
      enumValues: 'keep',
    },
    strictScalars: true,
    scalars: {
      ID: 'string',
      String: 'string',
      Boolean: 'boolean',
      Int: 'number',
      Float: 'number',
      CountryCode: 'string',
      Date: 'string',
      EmailAddress: 'string',
      NonEmptyString: 'string',
      PhoneNumber: 'string',
      PostalCode: 'string',
      _numeric: 'number[]',
      _text: 'string[]',
      _varchar: 'string[]',
      date: 'string',
      daterange: 'string',
      smallint: 'number',
      PositiveInt: 'number',
      int4range: 'string',
      bigint: 'number',
      NonNegativeFloat: 'number',
      interval: 'string',
      json: 'any',
      jsonb: 'any',
      JSONObject: 'any',
      JSON: 'any',
      numeric: 'number',
      numrange: 'string',
      NumericRange: 'string',
      sex: 'string',
      timestamp: 'DateTypes.LocalDateTimeString | string',
      timestamptz: 'DateTypes.TimestampTZString | string',
      DateTime: 'DateTypes.TimestampTZString',
      LocalDate: 'DateTypes.LocalDateString',
      LocalDateRange: 'DateTypes.LocalDateRangeString',
      tstzrange: 'string',
      uuid: 'string',
    },
  },
};

module.exports = {
  schema: [
    {
      [process.env.GQL_API_ENDPOINT]: {
        assumeValid: true,
        headers: {
          'X-Hasura-Role': 'user',
          'X-Hasura-User-Id': 'ci-user-for-codegen',
          'X-Hasura-Admin-Secret': process.env.HASURA_ADMIN_SECRET,
        },
      },
    },
  ],
  documents: ['./app/**/*.tsx', './app/**/*.ts'],
  overwrite: true,
  generates: {
    './app/generated/graphql.ts': generateBaseOptions,
    // './app/generated/without-hooks.ts': {
    //   ...generateBaseOptions,
    //   config: {
    //     ...generateBaseOptions.config,
    //     withHooks: false,
    //     apolloReactHooksImportFrom: undefined,
    //   },
    // },
    // './graphql.schema.json': {
    //   plugins: ['introspection'],
    // },
  },
  // hooks: {
  //   afterAllFileWrite: 'node ./generate-valid-anonymous-operations.js',
  // },
};
