public class IsLeapYear {

    public boolean determine(int year) {
        if (year % 4 == 0) {
            return true;
        }else {
            return false;
        }
    }
}