import java.util.Stack;

/**
 * The ParenthesisMatcher class checks whether a string of brackets is valid.
 *
 * A valid string means every open bracket is closed by the same type of bracket
 * and in the correct order.
 */
public class ParenthesisMatcher {

    /**
     * Checks whether the given bracket string is valid.
     *
     * @param s the bracket string to be checked
     * @return true if the bracket string is valid, false otherwise
     */
    public static boolean isValid(String s) {
        Stack<Character> stack = new Stack<Character>();

        for (int i = 0; i < s.length(); i++) {
            char ch = s.charAt(i);

            if (ch == '(' || ch == '{' || ch == '[') {
                stack.push(ch);
            } else {
                if (stack.isEmpty()) {
                    return false;
                }

                char top = stack.pop();

                if (ch == ')' && top != '(') {
                    return false;
                }

                if (ch == '}' && top != '{') {
                    return false;
                }

                if (ch == ']' && top != '[') {
                    return false;
                }
            }
        }

        return stack.isEmpty();
    }
}