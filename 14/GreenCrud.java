/**
 * The GreenCrud class calculates the population of green cruds.
 * 
 * The population grows every five days in the same way as the Fibonacci sequence.
 */
public class GreenCrud {

    /**
     * Calculates the population of green cruds after a given number of days.
     * 
     * @param initialSize the initial size of the green crud population
     * @param days the number of days after the population starts growing
     * @return the population size after the given number of days
     */
    public int calPopulation(int initialSize, int days) {
        int periods = days / 5;

        int fib1 = 1;
        int fib2 = 1;

        if (periods == 0 || periods == 1) {
            return initialSize;
        }

        int fib = 1;

        for (int i = 2; i <= periods; i++) {
            fib = fib1 + fib2;
            fib1 = fib2;
            fib2 = fib;
        }

        return initialSize * fib;
    }
}