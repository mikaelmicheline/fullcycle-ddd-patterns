import EventDispatcher from "../../@shared/event/event-dispatcher";
import AddressChangedEvent from "./address-changed.event";
import SendConsoleLogWhenAddressIsChangedHandler from "./handler/send-console-log-when-address-is-changed.handler";

describe("Address changed event tests", () => {  
  it("should notify all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const sendConsoleLogWhenAddressIsChangedHandler = new SendConsoleLogWhenAddressIsChangedHandler();
    const spyEventHandler = jest.spyOn(sendConsoleLogWhenAddressIsChangedHandler, "handle");

    eventDispatcher.register("AddressChangedEvent", sendConsoleLogWhenAddressIsChangedHandler);

    expect(
      eventDispatcher.getEventHandlers["AddressChangedEvent"][0]
    ).toMatchObject(sendConsoleLogWhenAddressIsChangedHandler);

    const addressChangedCreatedEvent = new AddressChangedEvent({
      id: "Customer 1",
      name: "John Doe",
      address: "Street One, 200, 55555-555 New York",
    });
    
    eventDispatcher.notify(addressChangedCreatedEvent);

    expect(spyEventHandler).toHaveBeenCalled();
  });
});
