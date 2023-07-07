import Order from "./order";
import OrderItem from "./order_item";

describe("Order unit tests", () => {
  it("should throw error when id is empty", () => {
    expect(() => {
      let order = new Order("", "123", []);
    }).toThrowError("Id is required");
  });

  it("should throw error when customerId is empty", () => {
    expect(() => {
      let order = new Order("123", "", []);
    }).toThrowError("CustomerId is required");
  });

  it("should throw error when customerId is empty", () => {
    expect(() => {
      let order = new Order("123", "123", []);
    }).toThrowError("Items are required");
  });

  it("should calculate total", () => {
    const item = new OrderItem("i1", "Item 1", 100, "p1", 2);
    const item2 = new OrderItem("i2", "Item 2", 200, "p2", 2);
    const order = new Order("o1", "c1", [item]);

    let total = order.total();

    expect(order.total()).toBe(200);

    const order2 = new Order("o1", "c1", [item, item2]);
    total = order2.total();
    expect(total).toBe(600);
  });

  it("should throw error if the item qte is less or equal zero 0", () => {
    expect(() => {
      const item = new OrderItem("i1", "Item 1", 100, "p1", 0);
      const order = new Order("o1", "c1", [item]);
    }).toThrowError("Quantity must be greater than 0");
  });

  it("should add a new item", () => {
    const item = new OrderItem("i1", "Item 1", 100, "p1", 2);
    const item2 = new OrderItem("i2", "Item 2", 200, "p2", 2);
    
    const order = new Order("o1", "c1", [item, item2]);

    const item3 = new OrderItem("i3", "Item 3", 300, "p3", 2);
    order.addItem(item3);

    expect(order.items.length).toBe(3);
  });

  it("should remove an item", () => {
    const item = new OrderItem("i1", "Item 1", 100, "p1", 2);
    const item2 = new OrderItem("i2", "Item 2", 200, "p2", 2);
    
    const order = new Order("o1", "c1", [item, item2]);
    
    order.removeItem(item2.id);

    expect(order.items.length).toBe(1);
  });

  it("should throw error if the item to be remove does not exist in the order", () => {
    expect(() => {
      const item = new OrderItem("i1", "Item 1", 100, "p1", 2);  
      const order = new Order("o1", "c1", [item]);      
      order.removeItem('i2');
    }).toThrowError("Item not found");
  });
});
