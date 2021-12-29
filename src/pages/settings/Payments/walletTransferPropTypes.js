import PropTypes from 'prop-types';
import CONST from '../../../CONST';

/** Wallet balance transfer props */
const walletTransferPropTypes = PropTypes.shape({
    /** Selected accountID for transfer */
    selectedAccountID: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

    /** Type to filter the payment Method list */
    filterPaymentMethodType: PropTypes.oneOf([CONST.PAYMENT_METHODS.DEBIT_CARD, CONST.PAYMENT_METHODS.BANK_ACCOUNT, '']),

    /** Whether the user has intiatied the tranfer and transfer request is submitted to backend. */
    completed: PropTypes.bool,
});

export default walletTransferPropTypes;
