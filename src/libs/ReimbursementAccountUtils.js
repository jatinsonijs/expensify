import * as BankAccounts from './actions/BankAccounts';
import FormHelper from './FormHelper';

const formHelper = new FormHelper({
    errorPath: 'reimbursementAccount.errorFields',
    setErrors: BankAccounts.setBankAccountFormValidationErrors,
});

const getErrors = props => formHelper.getErrors(props);
const clearError = (props, path) => formHelper.clearError(props, path);
const clearErrors = (props, paths) => formHelper.clearErrors(props, paths);

/**
 * @param {Object} props
 * @param {Object} errorTranslationKeys
 * @param {String} inputKey
 * @returns {String}
 */
function getErrorText(props, errorTranslationKeys, inputKey) {
    const errors = getErrors(props) || {};
    return errors[inputKey] ? props.translate(errorTranslationKeys[inputKey]) : '';
}

export {
    getErrors,
    clearError,
    clearErrors,
    getErrorText,
};
