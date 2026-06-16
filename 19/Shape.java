/**
 * The Shape class represents a geometric shape.
 *
 * It stores the length of the shape and provides methods to get
 * the area, perimeter, and information of the shape.
 */
public abstract class Shape {
    protected double length;

    /**
     * Sets the length of this shape.
     *
     * @param length the side length or diameter of the shape
     */
    public abstract void setLength(double length);

    /**
     * Gets the area of this shape.
     *
     * @return the area of this shape
     */
    public abstract double getArea();

    /**
     * Gets the perimeter of this shape.
     *
     * @return the perimeter of this shape
     */
    public abstract double getPerimeter();

    /**
     * Rounds a number to the second decimal place.
     *
     * @param value the value to be rounded
     * @return the rounded value
     */
    protected double roundToSecondDecimal(double value) {
        return Math.round(value * 100.0) / 100.0;
    }

    /**
     * Gets the area and perimeter information of this shape.
     *
     * @return the information string of this shape
     */
    public String getInfo() {
        return "Area = " + getArea() + ", Perimeter = " + getPerimeter();
    }
}