/**
 * The Circle class represents a circle.
 *
 * In this class, length means the diameter of the circle.
 */
public class Circle extends Shape {

    /**
     * Constructs a circle with the given diameter.
     *
     * @param length the diameter of the circle
     */
    public Circle(double length) {
        this.length = length;
    }

    /**
     * Sets the diameter of this circle.
     *
     * @param length the diameter of the circle
     */
    public void setLength(double length) {
        this.length = length;
    }

    /**
     * Gets the area of this circle.
     *
     * @return the area of this circle
     */
    public double getArea() {
        double radius = length / 2.0;
        return roundToSecondDecimal(Math.PI * radius * radius);
    }

    /**
     * Gets the perimeter of this circle.
     *
     * @return the perimeter of this circle
     */
    public double getPerimeter() {
        return roundToSecondDecimal(Math.PI * length);
    }
}