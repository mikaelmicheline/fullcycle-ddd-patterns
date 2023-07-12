import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import AddressChangedEvent from "../address-changed.event";

export default class SendConsoleLogWhenAddressIsChangedHandler
  implements EventHandlerInterface<AddressChangedEvent> {
  handle(event: AddressChangedEvent): void {
    const {id, name, address} = event.eventData;
    console.log(`Endereço do cliente: ${id}, ${name} alterado para: ${address}`); 
  }
}
