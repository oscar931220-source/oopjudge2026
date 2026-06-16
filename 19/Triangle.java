/**
 * The Triangle class represents a regular triangle.
 */
public class Triangle extends Shape {

    /**
     * Constructs a triangle with the given side length.
     *
     * @param length the side length of the triangle
     */
    public Triangle(double length) {
        this.length = length;
    }

    /**
     * Sets the side length of this triangle.
     *
     * @param length the side length of the triangle
     */
    public void setLength(double length) {
        this.length = length;
    }

    /**
     * Gets the area of this regular triangle.
     *
     * @return the area of this triangle
     */
    public double getArea() {
        return roundToSecondDecimal(Math.sqrt(3) / 4.0 * length * length);
    }

    /**
     * Gets the perimeter of this regular triangle.
     *
     * @return the perimeter of this triangle
     */
    public double getPerimeter() {
        return roundToSecondDecimal(3.0 * length);
    }
}