import { Sequelize } from "sequelize-typescript";
import Order from "../../../../domain/checkout/entity/order";
import OrderRepositoryInterface from "../../../../domain/checkout/repository/order-repository.interface";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
import OrderItem from "../../../../domain/checkout/entity/order_item";

export default class OrderRepository implements OrderRepositoryInterface {  
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }

  async update(entity: Order): Promise<void> {
    const previousOrder = await OrderModel.findOne({
      where: { id: entity.id },
      include: ["items"],
    });

    await OrderModel.update(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),        
      },
      {       
        where: {
          id: entity.id,
        },           
      },      
    )
    .then(async () => {
      const itemsToBeRemoved = previousOrder.items
        .filter(previousOrderItem => !entity.items.some(newOrderItem => newOrderItem.id === previousOrderItem.id))
        .map(previousOrderItem => previousOrderItem.id)

      await OrderItemModel.destroy({where: {id: itemsToBeRemoved}})

      const itemsToBeUpdated = entity.items
        .filter(newOrderItem => previousOrder.items.some(previousOrderItem => newOrderItem.id === previousOrderItem.id))
       
      for (const item of itemsToBeUpdated) {
        await OrderItemModel.update(
          {
            id: item.id,
            name: item.name,
            price: item.price,
            product_id: item.productId,
            quantity: item.quantity,     
          },
          {       
            where: {
              id: entity.id,
            },           
          },      
        )
      }

      const itemsToBeCreated = entity.items
        .filter(newOrderItem => !previousOrder.items.some(previousOrderItem => newOrderItem.id === previousOrderItem.id))
       
      for (const item of itemsToBeCreated) {
        await OrderItemModel.create(
          {
            id: item.id,
            name: item.name,
            price: item.price,
            product_id: item.productId,
            quantity: item.quantity,     
            order_id: entity.id
          }   
        )
      }
    })
  }
  
  async find(id: string): Promise<Order> {
    let orderModel;
    try {
      orderModel = await OrderModel.findOne({
        where: {
          id,
        },
        rejectOnEmpty: true,
        include: [{ model: OrderItemModel }],
      });
    } catch (error) {
      throw new Error("Order not found");
    }

    const items = []
    for (const item of orderModel.items) {
      items.push(new OrderItem(item.id, item.name, item.price, item.product_id, item.quantity))
    }

    return new Order(id, orderModel.customer_id, items);
  }

  async findAll(): Promise<Order[]> {    
    const orderModels = await OrderModel.findAll({ include: [{ model: OrderItemModel }] });
    return orderModels.map((orderModel) => {

      const items = []
      for (const item of orderModel.items) {
        items.push(new OrderItem(item.id, item.name, item.price, item.product_id, item.quantity))
      }

      return new Order(orderModel.id, orderModel.customer_id, items);
    });      
  }  
}
