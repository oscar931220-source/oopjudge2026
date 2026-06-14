import java.util.ArrayList;
import java.util.List;

/**
 * Manages course addition, removal, and listing operations.
 */
public class CourseSelectionSystem {

    /**
     * Processes a series of course selection commands.
     *
     * @param commands the course selection commands
     * @return the output produced by the commands
     */
    public static String process(String[] commands) {
        List<String> courses = new ArrayList<String>();
        List<String> outputs = new ArrayList<String>();

        for (String command : commands) {
            if (command.startsWith("add ")) {
                String courseName = command.substring(4);
                boolean exists = false;

                for (String course : courses) {
                    if (course.equalsIgnoreCase(courseName)) {
                        exists = true;
                        break;
                    }
                }

                if (exists) {
                    outputs.add("Course already exists");
                } else {
                    courses.add(courseName);
                }

            } else if (command.startsWith("remove ")) {
                String courseName = command.substring(7);
                int removeIndex = -1;

                for (int i = 0; i < courses.size(); i++) {
                    if (courses.get(i).equalsIgnoreCase(courseName)) {
                        removeIndex = i;
                        break;
                    }
                }

                if (removeIndex == -1) {
                    outputs.add("Course not found");
                } else {
                    courses.remove(removeIndex);
                }

            } else if (command.equals("list")) {
                if (courses.isEmpty()) {
                    outputs.add("No courses");
                } else {
                    outputs.add(String.join(", ", courses));
                }
            }
        }

        return String.join("\n", outputs);
    }
}