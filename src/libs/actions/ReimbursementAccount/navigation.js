import _ from 'underscore';
import lodashGet from 'lodash/get';
import Onyx from 'react-native-onyx';
import * as store from './store';
import CONST from '../../../CONST';
import ONYXKEYS from '../../../ONYXKEYS';
import ROUTES from '../../../ROUTES';
import Navigation from '../../Navigation/Navigation';

const WITHDRAWAL_ACCOUNT_STEPS = [
    {
        id: CONST.BANK_ACCOUNT.STEP.BANK_ACCOUNT,
        title: 'Bank Account',
    },
    {
        id: CONST.BANK_ACCOUNT.STEP.COMPANY,
        title: 'Company Information',
    },
    {
        id: CONST.BANK_ACCOUNT.STEP.REQUESTOR,
        title: 'Requestor Information',
    },
    {
        id: CONST.BANK_ACCOUNT.STEP.ACH_CONTRACT,
        title: 'Beneficial Owners',
    },
    {
        id: CONST.BANK_ACCOUNT.STEP.VALIDATION,
        title: 'Validate',
    },
    {
        id: CONST.BANK_ACCOUNT.STEP.ENABLE,
        title: 'Enable',
    },
];

/**
 * Get step position in the array
 * @private
 * @param {String} stepID
 * @return {Number}
 */
function getIndexByStepID(stepID) {
    return _.findIndex(WITHDRAWAL_ACCOUNT_STEPS, step => step.id === stepID);
}

/**
 * Navigate to a specific step in the VBA flow
 *
 * @param {String} stepID
 * @param {Object} newAchData
 */
function goToWithdrawalAccountSetupStep(stepID, newAchData) {
    const originalACHData = {...store.getReimbursementAccountInSetup()};

    Onyx.merge(ONYXKEYS.REIMBURSEMENT_ACCOUNT, {achData: {...originalACHData, ...newAchData, currentStep: stepID}});
}

/**
 * Navigate to the correct bank account route based on the bank account state and type
 */
function navigateToBankAccountRoute() {
    Navigation.navigate(ROUTES.getBankAccountRoute());
}

export {
    goToWithdrawalAccountSetupStep,
    navigateToBankAccountRoute,
};
