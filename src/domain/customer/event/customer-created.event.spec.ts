import EventDispatcher from "../../@shared/event/event-dispatcher";
import CustomerCreatedEvent from "./customer-created.event";
import SendConsoleLog1WhenCustomerIsCreatedHandler from "./handler/send-console-log-1-when-customer-is-created.handler";
import SendConsoleLog2WhenCustomerIsCreatedHandler from "./handler/send-console-log-2-when-customer-is-created.handler";

describe("Customer created event tests", () => {  
  it("should notify all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const sendConsoleLog1WhenCustomerIsCreatedHandler = new SendConsoleLog1WhenCustomerIsCreatedHandler();
    const sendConsoleLog2WhenCustomerIsCreatedHandler = new SendConsoleLog2WhenCustomerIsCreatedHandler();
    
    const spyEventHandler1 = jest.spyOn(sendConsoleLog1WhenCustomerIsCreatedHandler, "handle");
    const spyEventHandler2 = jest.spyOn(sendConsoleLog2WhenCustomerIsCreatedHandler, "handle");

    eventDispatcher.register("CustomerCreatedEvent", sendConsoleLog1WhenCustomerIsCreatedHandler);
    eventDispatcher.register("CustomerCreatedEvent", sendConsoleLog2WhenCustomerIsCreatedHandler);

    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
    ).toMatchObject(sendConsoleLog1WhenCustomerIsCreatedHandler);

    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]
    ).toMatchObject(sendConsoleLog2WhenCustomerIsCreatedHandler);

    const customerCreatedCreatedEvent = new CustomerCreatedEvent({
      id: "Customer 1",
      name: "Jane Doe"
    });
    
    eventDispatcher.notify(customerCreatedCreatedEvent);

    expect(spyEventHandler1).toHaveBeenCalled();
    expect(spyEventHandler2).toHaveBeenCalled();
  });
});
