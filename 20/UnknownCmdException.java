/**
 * The UnknownCmdException class represents an exception for invalid commands.
 */
public class UnknownCmdException extends Exception {

    /**
     * Constructs an UnknownCmdException with the given error message.
     *
     * @param errMessage the error message
     */
    public UnknownCmdException(String errMessage) {
        super(errMessage);
    }
}