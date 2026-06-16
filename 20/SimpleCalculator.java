import java.text.DecimalFormat;

/**
 * The SimpleCalculator class performs simple calculations.
 */
public class SimpleCalculator {
    private double result;
    private int count;
    private String operator;
    private double value;

    /**
     * Constructs a SimpleCalculator with result initialized to 0.
     */
    public SimpleCalculator() {
        result = 0.0;
        count = 0;
        operator = "";
        value = 0.0;
    }

    /**
     * Calculates the result according to the given command.
     *
     * @param cmd the command entered by the user
     * @throws UnknownCmdException if the command is invalid
     */
    public void calResult(String cmd) throws UnknownCmdException {
        String[] parts = cmd.split(" ", -1);

        if (parts.length != 2 || parts[0].length() != 1 || parts[1].length() == 0) {
            throw new UnknownCmdException("Please enter 1 operator and 1 value separated by 1 space");
        }

        String op = parts[0];
        String valStr = parts[1];

        boolean validOperator = op.equals("+") || op.equals("-") || op.equals("*") || op.equals("/");
        boolean validValue = true;
        double number = 0.0;

        try {
            number = Double.parseDouble(valStr);
        } catch (NumberFormatException e) {
            validValue = false;
        }

        if (!validOperator && !validValue) {
            throw new UnknownCmdException(op + " is an unknown operator and " + valStr + " is an unknown value");
        } else if (!validOperator) {
            throw new UnknownCmdException(op + " is an unknown operator");
        } else if (!validValue) {
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
     * Gets the message of the current calculation result.
     *
     * @return the message of the current result
     */
    public String getMsg() {
        DecimalFormat df = new DecimalFormat("0.00");

        if (count == 0) {
            return "Calculator is on. Result = " + df.format(result);
        } else if (count == 1) {
            return "Result " + operator + " " + df.format(value) + " = " + df.format(result)
                    + ". New result = " + df.format(result);
        } else {
            return "Result " + operator + " " + df.format(value) + " = " + df.format(result)
                    + ". Updated result = " + df.format(result);
        }
    }

    /**
     * Determines whether the calculation should end.
     *
     * @param cmd the command entered by the user
     * @return true if the command is r or R, false otherwise
     */
    public boolean endCalc(String cmd) {
        return cmd.equals("r") || cmd.equals("R");
    }
}