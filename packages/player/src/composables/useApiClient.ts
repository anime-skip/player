import { getSdk } from '../utils/api';
import { useAuthorizedGraphqlClient, useBaseGraphqlClient } from '../utils/api';

export default function (authorized = true) {
  return getSdk(
    authorized ? useAuthorizedGraphqlClient() : useBaseGraphqlClient(),
  );
}
