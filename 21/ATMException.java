/**
 * The ATMException class represents exceptions that may occur in ATM operations.
 */
public class ATMException extends Exception {

    /**
     * The ExceptionType enum contains all ATM exception types.
     */
    public enum ExceptionType {
        BALANCE_NOT_ENOUGH,
        AMOUNT_INVALID
    }

    private ExceptionType excptionCondition;

    /**
     * Constructs an ATMException with the given exception type.
     *
     * @param ex_type the exception type
     */
    public ATMException(ATMException.ExceptionType ex_type) {
        this.excptionCondition = ex_type;
    }

    /**
     * Gets the exception message.
     *
     * @return the exception type as a string
     */
    public String getMessage() {
        return excptionCondition.toString();
    }
}