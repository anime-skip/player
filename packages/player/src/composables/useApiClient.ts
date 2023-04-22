import { getSdk } from '../utils/api/graphql.generated';
import {
  useAuthorizedGraphqlClient,
  useBaseGraphqlClient,
} from '../utils/api-client';

export default function (authorized = true) {
  return getSdk(
    authorized ? useAuthorizedGraphqlClient() : useBaseGraphqlClient(),
  );
}
