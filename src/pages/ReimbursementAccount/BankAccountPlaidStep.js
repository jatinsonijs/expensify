import _ from 'underscore';
import React from 'react';
import {withOnyx} from 'react-native-onyx';
import PropTypes from 'prop-types';
import lodashGet from 'lodash/get';
import HeaderWithCloseButton from '../../components/HeaderWithCloseButton';
import CONST from '../../CONST';
import * as BankAccounts from '../../libs/actions/BankAccounts';
import Navigation from '../../libs/Navigation/Navigation';
import withLocalize, {withLocalizePropTypes} from '../../components/withLocalize';
import compose from '../../libs/compose';
import ONYXKEYS from '../../ONYXKEYS';
import AddPlaidBankAccount from '../../components/AddPlaidBankAccount';
import * as ReimbursementAccount from '../../libs/actions/ReimbursementAccount';
import Form from '../../components/Form';
import styles from '../../styles/styles';
import ScreenWrapper from '../../components/ScreenWrapper';
import reimbursementAccountPropTypes from './reimbursementAccountPropTypes';
import reimbursementAccountDraftPropTypes from './ReimbursementAccountDraftPropTypes';

const propTypes = {
    /** The bank account currently in setup */
    reimbursementAccount: reimbursementAccountPropTypes.isRequired,

    /** The draft values of the bank account being setup */
    reimbursementAccountDraft: reimbursementAccountDraftPropTypes.isRequired,

    /** The OAuth URI + stateID needed to re-initialize the PlaidLink after the user logs into their bank */
    receivedRedirectURI: PropTypes.string,

    /** During the OAuth flow we need to use the plaidLink token that we initially connected with */
    plaidLinkOAuthToken: PropTypes.string,

    /** Goes to the previous step */
    onBackButtonPress: PropTypes.func.isRequired,

    ...withLocalizePropTypes,
};

const defaultProps = {
    receivedRedirectURI: null,
    plaidLinkOAuthToken: '',
};

class BankAccountPlaidStep extends React.Component {
    constructor(props) {
        super(props);
        this.submit = this.submit.bind(this);
        this.getDefaultStateForField = this.getDefaultStateForField.bind(this);
    }

    /**
     * @param {String} fieldName
     * @param {*} defaultValue
     *
     * @returns {*}
     */
    getDefaultStateForField(fieldName, defaultValue = '') {
        return lodashGet(this.props.reimbursementAccountDraft, fieldName)
            || lodashGet(this.props.reimbursementAccount, ['achData', fieldName], defaultValue);
    }

    submit() {
        const selectedPlaidBankAccount = _.findWhere(lodashGet(this.props.plaidData, 'bankAccounts', []), {
            plaidAccountID: this.getDefaultStateForField('plaidAccountID'),
        });

        const bankAccountData = {
            routingNumber: selectedPlaidBankAccount.routingNumber,
            accountNumber: selectedPlaidBankAccount.accountNumber,
            plaidMask: selectedPlaidBankAccount.mask,
            isSavings: selectedPlaidBankAccount.isSavings,
            bankName: this.props.plaidData.bankName,
            plaidAccountID: selectedPlaidBankAccount.plaidAccountID,
            plaidAccessToken: this.props.plaidData.plaidAccessToken,
        };
        ReimbursementAccount.updateReimbursementAccountDraft(bankAccountData);

        const bankAccountID = this.getDefaultStateForField('bankAccountID', 0);
        BankAccounts.connectBankAccountWithPlaid(bankAccountID, bankAccountData);
    }

    render() {
        const bankAccountID = this.getDefaultStateForField('bankAccountID', 0);
        const selectedPlaidAccountID = this.getDefaultStateForField('plaidAccountID', '');

        return (
            <ScreenWrapper>
                <HeaderWithCloseButton
                    title={this.props.translate('workspace.common.bankAccount')}
                    stepCounter={{step: 1, total: 5}}
                    shouldShowGetAssistanceButton
                    guidesCallTaskID={CONST.GUIDES_CALL_TASK_IDS.WORKSPACE_BANK_ACCOUNT}
                    shouldShowBackButton
                    onBackButtonPress={this.props.onBackButtonPress}
                    onCloseButtonPress={Navigation.dismissModal}
                />
                <Form
                    formID={ONYXKEYS.FORMS.REIMBURSEMENT_ACCOUNT_FORM}
                    validate={() => ({})}
                    onSubmit={this.submit}
                    submitButtonText={this.props.translate('common.saveAndContinue')}
                    style={[styles.mh5, styles.flexGrow1]}
                    isSubmitButtonVisible={Boolean(selectedPlaidAccountID)}
                >
                    <AddPlaidBankAccount
                        text={this.props.translate('bankAccount.plaidBodyCopy')}
                        onSelect={(plaidAccountID) => {
                            ReimbursementAccount.updateReimbursementAccountDraft({plaidAccountID});
                        }}
                        onExitPlaid={() => BankAccounts.setBankAccountSubStep(null)}
                        receivedRedirectURI={this.props.receivedRedirectURI}
                        plaidLinkOAuthToken={this.props.plaidLinkOAuthToken}
                        allowDebit
                        bankAccountID={bankAccountID}
                        selectedPlaidAccountID={selectedPlaidAccountID}
                    />
                </Form>
            </ScreenWrapper>
        );
    }
}

BankAccountPlaidStep.propTypes = propTypes;
BankAccountPlaidStep.defaultProps = defaultProps;
export default compose(
    withLocalize,
    withOnyx({
        plaidData: {
            key: ONYXKEYS.PLAID_DATA,
        },
    }),
)(BankAccountPlaidStep);
