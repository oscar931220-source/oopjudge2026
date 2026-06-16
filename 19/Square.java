/**
 * The Square class represents a square.
 */
public class Square extends Shape {

    /**
     * Constructs a square with the given side length.
     *
     * @param length the side length of the square
     */
    public Square(double length) {
        this.length = length;
    }

    /**
     * Sets the side length of this square.
     *
     * @param length the side length of the square
     */
    public void setLength(double length) {
        this.length = length;
    }

    /**
     * Gets the area of this square.
     *
     * @return the area of this square
     */
    public double getArea() {
        return roundToSecondDecimal(length * length);
    }

    /**
     * Gets the perimeter of this square.
     *
     * @return the perimeter of this square
     */
    public double getPerimeter() {
        return roundToSecondDecimal(4.0 * length);
    }
}