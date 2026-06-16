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
        super(length);
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
        double area = length * length;
        return Math.round(area * 100.0) / 100.0;
    }

    /**
     * Gets the perimeter of this square.
     *
     * @return the perimeter of this square
     */
    public double getPerimeter() {
        double perimeter = 4.0 * length;
        return Math.round(perimeter * 100.0) / 100.0;
    }
}