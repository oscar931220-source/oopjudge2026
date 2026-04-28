public class IsLeapYear {

    public boolean determine(int year) {
        if (year % 100 == 0) {
            return false;
        }else if(year % 4 == 0){
            return true;
        }else {
        	return false;
        }
    }
}