import {MultisigVotingSettings, VotingSettings} from '@xinfin/osx-sdk-client';
import {useEffect, useState} from 'react';
import {HookData, SupportedVotingSettings} from 'utils/types';
import {DaofinPlugin} from '@xinfin/osx-daofin-contracts-ethers';
import {PluginTypes, usePluginClient} from './usePluginClient';
import {DaofinClient} from '@xinfin/osx-daofin-sdk-client';

export function isTokenVotingSettings(
  settings: SupportedVotingSettings | undefined
): settings is VotingSettings {
  if (!settings || Object.keys(settings).length === 0) return false;
  return 'minDuration' in settings;
}

export function isMultisigVotingSettings(
  settings: SupportedVotingSettings | undefined
): settings is MultisigVotingSettings {
  if (!settings || Object.keys(settings).length === 0) return false;
  return !('minDuration' in settings);
}

/**
 * Retrieves plugin governance settings from SDK
 * @param pluginAddress plugin from which proposals will be retrieved
 * @param type plugin type
 * @returns plugin governance settings
 */
export function usePluginSettings(
  pluginAddress: string,
  type: PluginTypes
): HookData<SupportedVotingSettings> {
  const [data, setData] = useState<SupportedVotingSettings>(
    {} as SupportedVotingSettings
  );
  const [error, setError] = useState<Error>();
  const [isLoading, setIsLoading] = useState(false);

  const client = usePluginClient(type);

  useEffect(() => {
    async function getPluginSettings() {
      try {
        setIsLoading(true);

        const settings = await client?.methods.getVotingSettings(pluginAddress);
        if (settings) setData(settings as VotingSettings);
      } catch (err) {
        console.error(err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    }

    getPluginSettings();
  }, [client?.methods, pluginAddress]);

  return {data, error, isLoading};
}
export function useDaofinElectionPeriods(
  pluginAddress: string
): HookData<DaofinPlugin.ElectionPeriodStruct[]> {
  const [data, setData] = useState<DaofinPlugin.ElectionPeriodStruct[]>(
    [] as DaofinPlugin.ElectionPeriodStruct[]
  );
  const [error, setError] = useState<Error>();
  const [isLoading, setIsLoading] = useState(false);

  const client = usePluginClient('any');

  useEffect(() => {
    async function getPluginSettings() {
      try {
        setIsLoading(true);
        console.log({client});
        
        const settings = await client?.methods.getElectionPeriods(
          pluginAddress
        );
        if (settings) setData(settings as DaofinPlugin.ElectionPeriodStruct[]);
      } catch (err) {
        console.error(err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    }

    getPluginSettings();
  }, [client?.methods, pluginAddress]);

  return {data, error, isLoading};
}
