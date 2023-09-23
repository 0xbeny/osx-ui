import {
  AlertInline,
  ButtonIcon,
  ButtonText,
  Dropdown,
  IconMenuVertical,
  Label,
  ListItemAction,
} from '@aragon/ods';
import React, {useEffect} from 'react';
import {useFieldArray, useFormContext, useWatch} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import styled from 'styled-components';

import {useAlertContext} from 'context/alert';
import useScreen from 'hooks/useScreen';
import {useWallet} from 'hooks/useWallet';
import {Row} from './row';
import { SelectEligibility } from 'components/selectEligibility';

export const CommitteeSettings = () => {
  const {t} = useTranslation();
  const {alert} = useAlertContext();
  const {address, ensName} = useWallet();

  const {control, trigger, setFocus} = useFormContext();
  const multisigWallets = useWatch({name: 'committeeSettings', control});
  const {fields, update, replace, append, remove} = useFieldArray({
    control,
    name: 'committeeSettings',
  });

  const controlledCommittees = fields.map((field, index) => {
    return {
      ...field,
      ...(multisigWallets && {...multisigWallets[index]}),
    };
  });

 


  // reset wallet
  const handleResetEntry = (index: number) => {
    update(index, {address: '', ensName: ''});
    alert(t('alert.chip.resetAddress'));
    trigger('multisigWallets');
  };


  const {isMobile} = useScreen();

  return (
    <Container>
      <DescriptionContainer>
          <Label
            label={t('labels.proposalCreation')}
            helpText={t('createDAO.step3.proposalCreationHelpertext')}
          />
          {controlledCommittees.map((field, index) => (
          <div key={field.id}>
            <Row
              index={index}
              onResetEntry={handleResetEntry}
              onDeleteEntry={handleDeleteEntry}
            />
          </div>
        ))}
        </DescriptionContainer>
    </Container>
  );
};

const Container = styled.div.attrs(() => ({
  className: 'space-y-1.5 flex flex-col',
}))``;
const DescriptionContainer = styled.div.attrs(() => ({
  className: 'space-y-0.5 flex flex-col',
}))``;
const TableContainer = styled.div.attrs(() => ({
  className: 'rounded-xl bg-ui-0 flex flex-col',
}))``;
const TableTitleContainer = styled.div.attrs(() => ({
  className: 'mx-3 mt-3 mb-1.5',
}))``;
const Title = styled.p.attrs({
  className: 'ft-text-base desktop:font-bold font-semibold text-ui-800',
})``;
const Text = styled.p.attrs({
  className: 'ft-text-base  text-ui-600',
})``;
const Divider = styled.div.attrs(() => ({
  className: 'flex bg-ui-50 h-0.25',
}))``;
const ActionsContainer = styled.div.attrs(() => ({
  className: 'flex desktop:px-3 desktop:py-1.5 p-2 place-content-between',
}))``;
const TextButtonsContainer = styled.div.attrs(() => ({
  className: 'flex gap-2',
}))``;

const SummaryContainer = styled.div.attrs(() => ({
  className: 'flex desktop:p-3 p-2 flex-col space-y-1.5',
}))``;
const TotalWalletsContainer = styled.div.attrs(() => ({
  className: 'flex place-content-between',
}))``;
