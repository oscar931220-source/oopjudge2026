/**
 * The ShapeFactory class creates different kinds of Shape objects.
 */
public class ShapeFactory {

    /**
     * The Type enum contains all kinds of shapes.
     */
    public enum Type {
        Triangle,
        Square,
        Circle
    }

    /**
     * Creates a shape according to the given shape type and length.
     *
     * @param shapeType the type of the shape
     * @param length the side length or diameter of the shape
     * @return a Shape object
     */
    public Shape createShape(ShapeFactory.Type shapeType, double length) {
        if (shapeType == Type.Triangle) {
            return new Triangle(length);
        } else if (shapeType == Type.Square) {
            return new Square(length);
        } else if (shapeType == Type.Circle) {
            return new Circle(length);
        }

        return null;
    }
}