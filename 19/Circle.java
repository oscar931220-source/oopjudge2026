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
        super(length);
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
        double area = Math.PI * radius * radius;
        return Math.round(area * 100.0) / 100.0;
    }

    /**
     * Gets the perimeter of this circle.
     *
     * @return the perimeter of this circle
     */
    public double getPerimeter() {
        double perimeter = Math.PI * length;
        return Math.round(perimeter * 100.0) / 100.0;
    }
}