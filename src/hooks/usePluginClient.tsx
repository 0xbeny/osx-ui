import {MultisigClient, TokenVotingClient} from '@xinfin/osx-sdk-client';
import {useEffect, useState} from 'react';

import {useClient} from './useClient';
import {DaofinClient, DaofinPluginContext} from '@xinfin/osx-daofin-sdk-client';
import {getNetwork} from '@ethersproject/networks';
export type PluginTypes =
  | 'token-voting.plugin.dao.eth'
  | 'multisig.plugin.dao.eth'
  | 'daofin'
  | 'any';

type PluginType<T> = T extends 'token-voting.plugin.dao.eth'
  ? TokenVotingClient
  : T extends 'multisig.plugin.dao.eth'
  ? MultisigClient
  : T extends 'daofin'
  ? DaofinClient
  : never;

export function isTokenVotingClient(
  client: TokenVotingClient | MultisigClient
): client is TokenVotingClient {
  if (!client || Object.keys(client).length === 0) return false;
  return client instanceof TokenVotingClient;
}

export function isMultisigClient(
  client: TokenVotingClient | MultisigClient
): client is MultisigClient {
  if (!client || Object.keys(client).length === 0) return false;
  return client instanceof MultisigClient;
}

/**
 * This hook can be used to build ERC20 or whitelist clients
 * @param pluginType Type of plugin for which a client is to be built. Note that
 * this is information that must be fetched. I.e., it might be unavailable on
 * first render. Therefore, it is typed as potentially undefined.
 * @returns The corresponding Client
 */
export const usePluginClient = <T extends PluginTypes = PluginTypes>(
  pluginType?: T
): PluginType<T> | undefined => {
  const [pluginClient, setPluginClient] = useState<PluginType<PluginTypes>>();

  const {client, context, daofinContext, daofinClient} = useClient();
  useEffect(() => {
    if (!client || !context || !daofinContext) return;

    if (!pluginType) {
      setPluginClient(undefined);
    } else {
      switch (pluginType as PluginTypes) {
        case 'multisig.plugin.dao.eth':
          setPluginClient(new MultisigClient(context));
          break;
        case 'token-voting.plugin.dao.eth':
          setPluginClient(new TokenVotingClient(context));
          break;
        // case 'daofin':
        //   setPluginClient(new DaofinClient(daofinContext));
        //   break;

        default:
          setPluginClient(new DaofinClient(daofinContext));
          break;
      }
    }
  }, [client, context, pluginType]);

  return pluginClient as PluginType<T>;
};
