import java.text.DecimalFormat;

/**
 * The SimpleCalculator class performs simple calculations.
 */
public class SimpleCalculator {
    private double result;
    private int count;
    private String operator;
    private double value;
    private boolean ended;

    /**
     * Constructs a SimpleCalculator with result initialized to 0.
     */
    public SimpleCalculator() {
        result = 0.0;
        count = 0;
        operator = "";
        value = 0.0;
        ended = false;
    }

    /**
     * Calculates the result according to the given command.
     *
     * @param cmd the command entered by the user
     * @throws UnknownCmdException if the command is invalid
     */
    public void calResult(String cmd) throws UnknownCmdException {
        if (cmd == null || cmd.length() == 0) {
            throw new UnknownCmdException("Please enter 1 operator and 1 value separated by 1 space");
        }

        if (cmd.indexOf(" ") == -1) {
            if (cmd.length() == 1 && !isOperator(cmd)) {
                throw new UnknownCmdException(cmd + " is an unknown value");
            } else {
                throw new UnknownCmdException("Please enter 1 operator and 1 value separated by 1 space");
            }
        }

        String[] parts = cmd.split(" ", -1);

        if (parts.length != 2 || parts[0].length() != 1 || parts[1].length() == 0) {
            throw new UnknownCmdException("Please enter 1 operator and 1 value separated by 1 space");
        }

        String op = parts[0];
        String valStr = parts[1];

        boolean validOperator = isOperator(op);
        boolean validValue = true;
        double number = 0.0;

        try {
            number = Double.parseDouble(valStr);
        } catch (NumberFormatException e) {
            validValue = false;
        }

        if (!validOperator && !validValue) {
            throw new UnknownCmdException(op + " is an unknown operator and " + valStr + " is an unknown value");
        }

        if (!validOperator) {
            throw new UnknownCmdException(op + " is an unknown operator");
        }

        if (!validValue) {
            throw new UnknownCmdException(valStr + " is an unknown value");
        }

        if (op.equals("/") && number == 0.0) {
            throw new UnknownCmdException("Can not divide by 0");
        }

        if (op.equals("+")) {
            result += number;
        } else if (op.equals("-")) {
            result -= number;
        } else if (op.equals("*")) {
            result *= number;
        } else if (op.equals("/")) {
            result /= number;
        }

        operator = op;
        value = number;
        count++;
    }

    /**
     * Checks whether the given string is a valid operator.
     *
     * @param op the operator string
     * @return true if the operator is valid, false otherwise
     */
    private boolean isOperator(String op) {
        return op.equals("+") || op.equals("-") || op.equals("*") || op.equals("/");
    }

    /**
     * Gets the message of the current calculation result.
     *
     * @return the message of the current result
     */
    public String getMsg() {
        DecimalFormat df = new DecimalFormat("0.00");

        if (ended) {
            return "Final result = " + df.format(result);
        }

        if (count == 0) {
            return "Calculator is on. Result = " + df.format(result);
        }

        if (count == 1) {
            return "Result " + operator + " " + df.format(value) + " = " + df.format(result)
                    + ". New result = " + df.format(result);
        }

        return "Result " + operator + " " + df.format(value) + " = " + df.format(result)
                + ". Updated result = " + df.format(result);
    }

    /**
     * Determines whether the calculation should end.
     *
     * @param cmd the command entered by the user
     * @return true if the command is r or R, false otherwise
     */
    public boolean endCalc(String cmd) {
        if (cmd.equals("r") || cmd.equals("R")) {
            ended = true;
            return true;
        }

        return false;
    }
}